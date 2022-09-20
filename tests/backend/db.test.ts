import {
	DeleteCharacterItemHandlingMethods,
	FullSheet,
	SheetState,
	SheetStatePartialUpdateAction,
} from "$sheets/types";
import { generateCharacter, getCarriedItems } from "$sheets/utils";
import { OmitId } from "$root/types";
import {
	healthPotionFixture,
	longswordFixture,
} from "../fixtures/itemFixtures";
import { merge } from "merge-anything";
import tweakString from "../utils/tweakString";
import prisma from "$prisma";
import dbReducer from "$backend/dbReducer";
import { Character, Item } from "@prisma/client";
import createSheetFromFlatData from "$backend/createSheetFromFlatData";

/**
 * Function for generating a new sheet for testing.
 * Sheet is deleted once tests are completed
 *
 * @param testFn A callback containing tests
 * to be executed. The callback is passed::
 * - initialState: The state of sheet as it was created
 * - update: A function to dispatch actions on that sheet
 * and then return the updated state
 * @param [initialStateTweaks={}] An object which
 * is merged with a basic sheet inventory state to derive
 * derive the starting state of the sheet. The basic initial
 * sheet has the name "name" and no characters or items.
 */
const testDbReducer = async (
	testFn: (
		initialState: FullSheet,
		update: (action: SheetStatePartialUpdateAction) => Promise<FullSheet>
	) => Promise<void>,
	initialStateTweaks: Partial<OmitId<FullSheet>> = {}
): Promise<void> => {
	const newSheet = await createSheetFromFlatData({
		characters: [],
		items: [],
		name: "name",
		...initialStateTweaks,
	});
	// const newSheet = await new SheetModel(
	// 	merge(
	// 		{
	// 			name: "name",
	// 			characters: [],
	// 			items: [],
	// 		},
	// 		initialStateTweaks
	// 	)
	// ).save();

	/**
	 * Update the sheet via an action and return the
	 * updated state
	 *
	 * @param action The action to execute
	 * upon th sheet.
	 * @returns The state of the sheet
	 * after the action has been executed.
	 */
	const update = async (action: SheetStatePartialUpdateAction) => {
		await dbReducer(newSheet.id, action);
		const updatedSheet = await prisma.sheet.findFirstOrThrow({
			where: {
				id: newSheet.id,
			},
			include: {
				characters: true,
				items: true,
			},
		});
		return updatedSheet;
	};

	await testFn(newSheet, update);
	//? Execute the test function

	await prisma.sheet.delete({
		where: {
			id: newSheet.id,
		},
	});

	//? Delete the sheet
};

describe("DB Reducer Actions", () => {
	const testItem: Item = {
		id: "id",
		name: "name",
		quantity: 1,
		weight: 1,
		description: null,
		carriedByCharacterId: null,
		category: null,
		referenceLink: null,
		sheetId: "",
		value: 1,
	};

	test("Create item", () =>
		testDbReducer(async (originalState, update) => {
			const updatedState = await update({
				type: "item_add",
				data: testItem,
			});
			expect(updatedState.items.length).toBeGreaterThan(
				originalState.items.length
			);
			expect(updatedState.items[0]).toMatchObject(testItem);
		}));

	test("Update item", () =>
		testDbReducer(
			async (originalState, update) => {
				const updatedState = await update({
					type: "item_update",
					data: {
						id: testItem.id,
						name: tweakString(testItem.name),
					},
				});
				expect(updatedState.items[0]).toMatchObject({
					...testItem,
					name: tweakString(testItem.name),
				});
			},
			{
				items: [testItem],
			}
		));

	test("Delete item", () =>
		testDbReducer(
			async (_, update) => {
				const updatedState = await update({
					type: "item_remove",
					data: testItem.id,
				});
				expect(updatedState.items.length).toEqual(0);
			},
			{
				items: [testItem],
			}
		));

	test("Sheet Metadata Update (name only)", async () =>
		testDbReducer(async (originalState, update) => {
			const updatedState = await update({
				type: "sheet_metadataUpdate",
				data: {
					name: tweakString(originalState.name),
					characters: {
						add: [],
						remove: [],
						update: [],
					},
				},
			});
			expect(updatedState).not.toMatchObject(originalState);
			expect(updatedState.name).not.toEqual(originalState.name);
			expect(updatedState.name).toEqual(tweakString(originalState.name));
		}));
});

describe("Metadata Member updates", () => {
	const testMembers: Character[] = [
		generateCharacter("1"),
		generateCharacter("1"),
	];

	/**
	 * Function to fetch test items. The test items are
	 * pulled from the fixtures folder, with their
	 * `carriedByCharacterId` field changed to match passed characters.
	 *
	 * @param member The member object, the `id`
	 * of which is passed to the first test item.
	 * @param [member2=member] The member to carry
	 * the second item.
	 * @returns The items with altered `carriedByCharacterId`
	 */
	const getTestItems = (member: Character, member2 = member): Item[] => [
		{ ...longswordFixture, carriedByCharacterId: member.id },
		{ ...healthPotionFixture, carriedByCharacterId: member2.id },
	];

	test("Add member", () =>
		testDbReducer(async (originalState, update) => {
			const updated = await update({
				type: "sheet_metadataUpdate",
				data: {
					name: originalState.name,
					characters: { add: [testMembers[0]], remove: [], update: [] },
				},
			});
			expect(updated.characters.length).toEqual(1);
		}));
	test("Add multiple characters", () =>
		testDbReducer(async (originalState, update) => {
			const updated = await update({
				type: "sheet_metadataUpdate",
				data: {
					name: originalState.name,
					characters: { add: testMembers, remove: [], update: [] },
				},
			});
			expect(updated.characters.length).toEqual(testMembers.length);
		}));

	test("Remove member - Remove item", () =>
		testDbReducer(
			async (originalState, update) => {
				expect(originalState.items.length).toEqual(1);

				const updated = await update({
					type: "sheet_metadataUpdate",
					data: {
						name: originalState.name,
						characters: {
							add: [],
							remove: [
								{
									...testMembers[0],
									deleteMethod: {
										mode: DeleteCharacterItemHandlingMethods.delete,
									},
								},
							],
							update: [],
						},
					},
				});
				expect(updated.items.length).toEqual(0);
			},
			{
				characters: [testMembers[0]],
				items: [getTestItems(testMembers[0])[0]],
			}
		));

	test("Remove member - Remove multiple items", () =>
		testDbReducer(
			async (originalState, update) => {
				expect(originalState.items.length).toEqual(2);

				const updated = await update({
					type: "sheet_metadataUpdate",
					data: {
						name: originalState.name,
						characters: {
							add: [],
							remove: [
								{
									...testMembers[0],
									deleteMethod: {
										mode: DeleteCharacterItemHandlingMethods.delete,
									},
								},
							],
							update: [],
						},
					},
				});
				expect(updated.items.length).toEqual(0);
			},
			{
				characters: [testMembers[0]],
				items: getTestItems(testMembers[0]),
			}
		));
	test("Remove member - Move item to another member", () =>
		testDbReducer(
			async (originalState, update) => {
				expect(originalState.items.length).toEqual(2);

				const updated = await update({
					type: "sheet_metadataUpdate",
					data: {
						name: originalState.name,
						characters: {
							add: [],
							remove: [
								{
									...testMembers[0],
									deleteMethod: {
										mode: DeleteCharacterItemHandlingMethods.give,
										to: testMembers[1].id,
									},
								},
							],
							update: [],
						},
					},
				});
				expect(updated.items.length).toEqual(2);
				expect(updated.items).toEqual(
					getCarriedItems(updated.items, testMembers[1])
				);
			},
			{
				characters: [testMembers[0], testMembers[1]],
				items: getTestItems(testMembers[0], testMembers[1]),
			}
		));
	test("Remove member - Move multiple items to another member", () =>
		testDbReducer(
			async (originalState, update) => {
				expect(originalState.items.length).toEqual(3);
				expect(
					getCarriedItems(originalState.items, testMembers[0]).length
				).toEqual(1);
				expect(
					getCarriedItems(originalState.items, testMembers[1]).length
				).toEqual(2);

				const updated = await update({
					type: "sheet_metadataUpdate",
					data: {
						name: originalState.name,
						characters: {
							add: [],
							remove: [
								{
									...testMembers[1],
									deleteMethod: {
										mode: DeleteCharacterItemHandlingMethods.give,
										to: testMembers[0].id,
									},
								},
							],
							update: [],
						},
					},
				});
				expect(updated.items.length).toEqual(3);
				expect(updated.items).toEqual(
					getCarriedItems(updated.items, testMembers[0])
				);
			},
			{
				characters: [testMembers[0], testMembers[1]],
				items: [
					{
						id: "1",
						name: " ",
						quantity: 1,
						weight: 1,
						carriedByCharacterId: testMembers[0].id,
						category: null,
						description: null,
						referenceLink: null,
						sheetId: "",
						value: 1,
					},
					{
						id: "2",
						name: " ",
						quantity: 1,
						weight: 1,
						carriedByCharacterId: testMembers[1].id,
						category: null,
						description: null,
						referenceLink: null,
						sheetId: "",
						value: 1,
					},
					{
						id: "3",
						name: " ",
						quantity: 1,
						weight: 1,
						carriedByCharacterId: testMembers[1].id,
						category: null,
						description: null,
						referenceLink: null,
						sheetId: "",
						value: 1,
					},
				],
			}
		));

	test("Remove member - Set to nobody", () =>
		testDbReducer(
			async (originalState, update) => {
				expect(originalState.items.length).toEqual(1);

				const updated = await update({
					type: "sheet_metadataUpdate",
					data: {
						name: originalState.name,
						characters: {
							add: [],
							remove: [
								{
									...testMembers[0],
									deleteMethod: {
										mode: DeleteCharacterItemHandlingMethods.setToNobody,
									},
								},
							],
							update: [],
						},
					},
				});
				expect(updated.items.length).toEqual(1);
				expect(updated.items).toEqual(getCarriedItems(updated.items, "Nobody"));
			},
			{
				characters: [testMembers[0]],
				items: [getTestItems(testMembers[0])[0]],
			}
		));
	test("Remove member - Set multiple to nobody", () =>
		testDbReducer(
			async (originalState, update) => {
				expect(originalState.items.length).toEqual(2);

				const updated = await update({
					type: "sheet_metadataUpdate",
					data: {
						name: originalState.name,
						characters: {
							add: [],
							remove: [
								{
									...testMembers[0],
									deleteMethod: {
										mode: DeleteCharacterItemHandlingMethods.setToNobody,
									},
								},
							],
							update: [],
						},
					},
				});
				expect(updated.items.length).toEqual(originalState.items.length);
				expect(updated.items).toEqual(getCarriedItems(updated.items, "Nobody"));
			},
			{
				characters: [testMembers[0]],
				items: getTestItems(testMembers[0]),
			}
		));
	test("Update member", () =>
		testDbReducer(
			async (originalState, update) => {
				const updated = await update({
					type: "sheet_metadataUpdate",
					data: {
						name: originalState.name,
						characters: {
							add: [],
							remove: [],
							update: [
								{
									...testMembers[0],
									name: tweakString(testMembers[0].name),
								},
							],
						},
					},
				});
				expect(updated.characters).not.toEqual(originalState.characters);
				expect(updated.characters.length).toEqual(
					originalState.characters.length
				);
				expect(updated.characters[0].name).toEqual(
					tweakString(testMembers[0].name)
				);
			},
			{
				characters: [testMembers[0]],
			}
		));
	test("Update multiple characters", () =>
		testDbReducer(
			async (originalState, update) => {
				const updated = await update({
					type: "sheet_metadataUpdate",
					data: {
						name: originalState.name,
						characters: {
							add: [],
							remove: [],
							update: testMembers.map(({ name, ...mem }) => ({
								...mem,
								name: tweakString(name),
							})),
						},
					},
				});

				expect(updated.characters).not.toEqual(originalState.characters);
				expect(updated.characters.length).toEqual(
					originalState.characters.length
				);
				expect(updated.characters.map((m) => m.name)).toEqual(
					originalState.characters.map((m) => tweakString(m.name))
				);
			},
			{
				characters: testMembers,
			}
		));
});
