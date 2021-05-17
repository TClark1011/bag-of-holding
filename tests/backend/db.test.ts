import connectToMongoose from "../../src/db/connectToMongoose";
import dbReducer from "../../src/db/dbReducer";
import SheetModel from "../../src/db/SheetModel";
import InventoryItemFields from "../../src/types/InventoryItemFields";
import InventorySheetFields from "../../src/types/InventorySheetFields";
import mongoose from "mongoose";
import {
	DeleteMemberItemHandlingMethods,
	InventorySheetPartialUpdateAction,
} from "../../src/types/InventorySheetState";
import generateMember from "../../src/generators/generateMember";
import InventoryMemberFields from "../../src/types/InventoryMemberFields";
import { OmitId } from "../../src/types/UtilityTypes";
import {
	healthPotionFixture,
	longswordFixture,
} from "../fixtures/itemFixtures";
import { merge } from "merge-anything";
import getCarriedItems from "../../src/utils/getCarriedItems";
import tweakString from "../utils/tweakString";
import { MongoMemoryServer } from "mongodb-memory-server";

const mockedMongo = new MongoMemoryServer();

beforeAll(async () => {
	await connectToMongoose(await mockedMongo.getUri());
});

afterAll(async () => {
	await mongoose.disconnect().catch((err) => {
		console.log("error with 'mongoose.disconnect'");
		console.log(err);
	});
	await mongoose.connection.close().catch((err) => {
		console.log("error with 'mongoose.connection.close'");
		console.log(err);
	});
	await mockedMongo.stop();
});

/**
 * Function for generating a new sheet for testing.
 * Sheet is deleted once tests are completed
 *
 * @param {Function} testFn A callback containing tests
 * to be executed. The callback is passed::
 * - initialState: The state of sheet as it was created
 * - update: A function to dispatch actions on that sheet
 * and then return the updated state
 * @param {object} [initialStateTweaks={}] An object which
 * is merged with a basic sheet inventory state to derive
 * derive the starting state of the sheet. The basic initial
 * sheet has the name "name" and no members or items.
 */
const testDbReducer = async (
	testFn: (
		initialState: InventorySheetFields,
		update: (
			action: InventorySheetPartialUpdateAction
		) => Promise<InventorySheetFields>
	) => Promise<void>,
	initialStateTweaks: Partial<OmitId<InventorySheetFields>> = {}
): Promise<void> => {
	const newSheet = await new SheetModel(
		merge(
			{
				name: "name",
				members: [],
				items: [],
			},
			initialStateTweaks
		)
	).save();

	/**
	 * Update the sheet via an action and return the
	 * updated state
	 *
	 * @param {object} action The action to execute
	 * upon th sheet.
	 * @returns {Promise<object>} The state of the sheet
	 * after the action has been executed.
	 */
	const update = async (action: InventorySheetPartialUpdateAction) => {
		await dbReducer((newSheet._id as unknown) as string, action);
		return (await (SheetModel.findById(
			(newSheet._id as unknown) as string
		) as unknown)) as InventorySheetFields;
	};

	await testFn((newSheet as unknown) as InventorySheetFields, update);
	//? Execute the test function

	await newSheet.delete();
	//? Delete the sheet
};

describe("DB Reducer Actions", () => {
	const testItem: InventoryItemFields = {
		_id: "id",
		name: "name",
		quantity: 1,
		weight: 1,
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
						_id: testItem._id,
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
					data: testItem._id,
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
					members: {
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
	const testMembers: InventoryMemberFields[] = [
		generateMember("1"),
		generateMember("1"),
	];

	/**
	 * Function to fetch test items. The test items are
	 * pulled from the fixtures folder, with their
	 * `carriedBy` field changed to match passed members.
	 *
	 * @param {object} member The member object, the `_id`
	 * of which is passed to the first test item.
	 * @param {object} [member2=member] The member to carry
	 * the second item.
	 * @returns {object[]} The items with altered `carriedBy`
	 */
	const getTestItems = (member: InventoryMemberFields, member2 = member) => [
		{ ...longswordFixture, carriedBy: member._id },
		{ ...healthPotionFixture, carriedBy: member2._id },
	];

	test("Add member", () =>
		testDbReducer(async (originalState, update) => {
			const updated = await update({
				type: "sheet_metadataUpdate",
				data: {
					name: originalState.name,
					members: { add: [testMembers[0]], remove: [], update: [] },
				},
			});
			expect(updated.members.length).toEqual(1);
		}));
	test("Add multiple members", () =>
		testDbReducer(async (originalState, update) => {
			const updated = await update({
				type: "sheet_metadataUpdate",
				data: {
					name: originalState.name,
					members: { add: testMembers, remove: [], update: [] },
				},
			});
			expect(updated.members.length).toEqual(testMembers.length);
		}));

	test("Remove member - Remove item", () =>
		testDbReducer(
			async (originalState, update) => {
				expect(originalState.items.length).toEqual(1);

				const updated = await update({
					type: "sheet_metadataUpdate",
					data: {
						name: originalState.name,
						members: {
							add: [],
							remove: [
								{
									...testMembers[0],
									deleteMethod: {
										mode: DeleteMemberItemHandlingMethods.delete,
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
				members: [testMembers[0]],
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
						members: {
							add: [],
							remove: [
								{
									...testMembers[0],
									deleteMethod: {
										mode: DeleteMemberItemHandlingMethods.delete,
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
				members: [testMembers[0]],
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
						members: {
							add: [],
							remove: [
								{
									...testMembers[0],
									deleteMethod: {
										mode: DeleteMemberItemHandlingMethods.give,
										to: testMembers[1]._id,
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
				members: [testMembers[0], testMembers[1]],
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
						members: {
							add: [],
							remove: [
								{
									...testMembers[1],
									deleteMethod: {
										mode: DeleteMemberItemHandlingMethods.give,
										to: testMembers[0]._id,
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
				members: [testMembers[0], testMembers[1]],
				items: [
					{
						_id: "1",
						name: " ",
						quantity: 1,
						weight: 1,
						carriedBy: testMembers[0]._id,
					},
					{
						_id: "2",
						name: " ",
						quantity: 1,
						weight: 1,
						carriedBy: testMembers[1]._id,
					},
					{
						_id: "3",
						name: " ",
						quantity: 1,
						weight: 1,
						carriedBy: testMembers[1]._id,
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
						members: {
							add: [],
							remove: [
								{
									...testMembers[0],
									deleteMethod: {
										mode: DeleteMemberItemHandlingMethods.setToNobody,
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
				members: [testMembers[0]],
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
						members: {
							add: [],
							remove: [
								{
									...testMembers[0],
									deleteMethod: {
										mode: DeleteMemberItemHandlingMethods.setToNobody,
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
				members: [testMembers[0]],
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
						members: {
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
				expect(updated.members).not.toEqual(originalState.members);
				expect(updated.members.length).toEqual(originalState.members.length);
				expect(updated.members[0].name).toEqual(
					tweakString(testMembers[0].name)
				);
			},
			{
				members: [testMembers[0]],
			}
		));
	test("Update multiple members", () =>
		testDbReducer(
			async (originalState, update) => {
				const updated = await update({
					type: "sheet_metadataUpdate",
					data: {
						name: originalState.name,
						members: {
							add: [],
							remove: [],
							update: testMembers.map(({ name, ...mem }) => ({
								...mem,
								name: tweakString(name),
							})),
						},
					},
				});

				expect(updated.members).not.toEqual(originalState.members);
				expect(updated.members.length).toEqual(originalState.members.length);
				expect(updated.members.map((m) => m.name)).toEqual(
					originalState.members.map((m) => tweakString(m.name))
				);
			},
			{
				members: testMembers,
			}
		));
});
