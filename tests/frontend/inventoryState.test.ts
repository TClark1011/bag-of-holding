import { DeleteCharacterItemHandlingMethods, SheetState } from "$sheets/types";
import { inventoryReducer } from "$sheets/store";
import { getCarriedItems } from "$sheets/utils";
import { averageMembersFixture } from "../fixtures/charactersFixtures";
import {
	generateRandomInventoryItem,
	generateRandomPartyMember,
} from "../utils/randomGenerators";
import tweakString from "../utils/tweakString";
import { getIds } from "$root/utils";
import { Item } from "@prisma/client";

const testState: SheetState = {
	id: "0",
	name: "Test Sheet",
	characters: [],
	items: [],
};

const testItem: Item = {
	id: "0",
	name: "Test Item",
	quantity: 1,
	weight: 1,
	value: 1,
	carriedByCharacterId: null,
	category: null,
	description: null,
	referenceLink: null,
	sheetId: testState.id,
};

const testStateWithTestItem = { ...testState, items: [testItem] };

describe("Inventory State Reducer Actions", () => {
	test("Add Item", () => {
		expect(
			inventoryReducer(testState, {
				type: "item_add",
				data: testItem,
			})
		).toMatchObject(testStateWithTestItem);
	});

	test("Remove Item", () => {
		expect(
			inventoryReducer(testStateWithTestItem, {
				type: "item_remove",
				data: testItem.id,
			})
		).toMatchObject(testState);
	});

	test("Update Items", () => {
		const newName = testItem.name + "+";
		expect(
			inventoryReducer(testStateWithTestItem, {
				type: "item_update",
				data: {
					id: testItem.id,
					name: newName,
					carriedByCharacterId: null,
					sheetId: "",
					description: null,
					quantity: 1,
					referenceLink: null,
					value: 1,
					category: null,
					weight: null,
				},
			})
		).toMatchObject({
			...testState,
			items: [
				expect.objectContaining({
					name: newName,
				}),
			],
		});
	});

	test("Full Update", () => {
		expect(
			inventoryReducer(testStateWithTestItem, {
				type: "sheet_update",
				data: testState,
			})
		).toEqual(testState);
	});

	// test("Metadata Update", () => {
	// 	const newName = tweakString;
	// 	const testMember = averageMembersFixture[0];
	// 	expect(
	// 		inventoryReducer(testState, {
	// 			type: "sheet_metadataUpdate",
	// 			data: {
	// 				name: newName,
	// 				characters: [testMember],
	// 			},
	// 		})
	// 	).toMatchObject({ ...testState, name: newName, characters: [testMember] });
	// });
});

describe("Metadata updates", () => {
	test("Change sheet name", () => {
		expect(
			inventoryReducer(testState, {
				type: "sheet_metadataUpdate",
				data: {
					name: tweakString(testState.name),
					characters: {
						add: [],
						update: [],
						remove: [],
					},
				},
			})
		).toMatchObject({
			...testState,
			name: tweakString(testState.name),
		});
	});

	test("Add character", () => {
		const updatedState = inventoryReducer(testState, {
			type: "sheet_metadataUpdate",
			data: {
				name: testState.name,
				characters: {
					add: [averageMembersFixture[0]],
					update: [],
					remove: [],
				},
			},
		});
		expect(updatedState.characters).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					name: averageMembersFixture[0].name,
					carryCapacity: averageMembersFixture[0].carryCapacity,
				}),
			])
		);
	});

	test("Add multiple characters", () => {
		const updatedState = inventoryReducer(testState, {
			type: "sheet_metadataUpdate",
			data: {
				name: testState.name,
				characters: {
					add: averageMembersFixture,
					update: [],
					remove: [],
				},
			},
		});

		expect(updatedState.characters).toEqual(
			expect.arrayContaining(
				averageMembersFixture.map((c) =>
					expect.objectContaining({
						name: c.name,
						carryCapacity: c.carryCapacity,
					})
				)
			)
		);
	});
	test("Remove member (delete item)", () => {
		const updatedState = inventoryReducer(
			{
				...testState,
				characters: [averageMembersFixture[0]],
				items: [
					generateRandomInventoryItem({
						carriedByCharacterId: averageMembersFixture[0].id,
					}),
				],
				//? Generate 2 random inventory items
			},
			{
				type: "sheet_metadataUpdate",
				data: {
					name: testState.name,
					characters: {
						remove: [
							{
								...averageMembersFixture[0],
								deleteMethod: {
									mode: DeleteCharacterItemHandlingMethods.delete,
								},
							},
						],
						add: [],
						update: [],
					},
				},
			}
		);
		expect(updatedState.characters).toEqual([]);
		expect(updatedState.items).toEqual([]);
	});

	test("Remove member (delete multiple items)", () => {
		const updatedState = inventoryReducer(
			{
				...testState,
				characters: [averageMembersFixture[0]],
				items: Array.from([null, null], () =>
					generateRandomInventoryItem({
						carriedByCharacterId: averageMembersFixture[0].id,
					})
				),
				//? Generate 2 random inventory items
			},
			{
				type: "sheet_metadataUpdate",
				data: {
					name: testState.name,
					characters: {
						remove: [
							{
								...averageMembersFixture[0],
								deleteMethod: {
									mode: DeleteCharacterItemHandlingMethods.delete,
								},
							},
						],
						add: [],
						update: [],
					},
				},
			}
		);
		expect(updatedState.characters).toEqual([]);
		expect(updatedState.items).toEqual([]);
	});

	test("Remove member (give item)", () => {
		const updatedState = inventoryReducer(
			{
				...testState,
				characters: [averageMembersFixture[0], averageMembersFixture[1]],
				items: [
					generateRandomInventoryItem({
						carriedByCharacterId: averageMembersFixture[1].id,
					}),
				],
				//? Generate 2 random inventory items
			},
			{
				type: "sheet_metadataUpdate",
				data: {
					name: testState.name,
					characters: {
						remove: [
							{
								...averageMembersFixture[1],
								deleteMethod: {
									mode: DeleteCharacterItemHandlingMethods.give,
									to: averageMembersFixture[0].id,
								},
							},
						],
						add: [],
						update: [],
					},
				},
			}
		);
		expect(updatedState.characters).toEqual([averageMembersFixture[0]]);
		expect(updatedState.items.length).toEqual(1);
		expect(updatedState.items[0].carriedByCharacterId).toEqual(
			averageMembersFixture[0].id
		);
	});

	test("Remove member (give multiple items)", () => {
		const updatedState = inventoryReducer(
			{
				...testState,
				characters: [averageMembersFixture[0], averageMembersFixture[1]],
				items: Array.from([null, null], () =>
					generateRandomInventoryItem({
						carriedByCharacterId: averageMembersFixture[1].id,
					})
				),
				//? Generate 2 random inventory items
			},
			{
				type: "sheet_metadataUpdate",
				data: {
					name: testState.name,
					characters: {
						remove: [
							{
								...averageMembersFixture[1],
								deleteMethod: {
									mode: DeleteCharacterItemHandlingMethods.give,
									to: averageMembersFixture[0].id,
								},
							},
						],
						add: [],
						update: [],
					},
				},
			}
		);
		expect(updatedState.characters).toEqual([averageMembersFixture[0]]);
		expect(updatedState.items).toEqual(
			getCarriedItems(updatedState.items, averageMembersFixture[0])
		);
	});

	test("Remove member (mark item as carried by nobody)", () => {
		const updatedState = inventoryReducer(
			{
				...testState,
				characters: [averageMembersFixture[0]],
				items: [
					generateRandomInventoryItem({
						carriedByCharacterId: averageMembersFixture[0].id,
					}),
				],
				//? Generate 2 random inventory items
			},
			{
				type: "sheet_metadataUpdate",
				data: {
					name: testState.name,
					characters: {
						remove: [
							{
								...averageMembersFixture[0],
								deleteMethod: {
									mode: DeleteCharacterItemHandlingMethods.setToNobody,
								},
							},
						],
						add: [],
						update: [],
					},
				},
			}
		);
		expect(updatedState.characters).toEqual([]);
		expect(updatedState.items.length).toEqual(1);
		expect(updatedState.items[0].carriedByCharacterId).toEqual("Nobody");
	});

	test("Remove member (mark multiple items as carried by nobody)", () => {
		const updatedState = inventoryReducer(
			{
				...testState,
				characters: [averageMembersFixture[0], averageMembersFixture[1]],
				items: Array.from([null, null], () =>
					generateRandomInventoryItem({
						carriedByCharacterId: averageMembersFixture[1].id,
					})
				),
				//? Generate 2 random inventory items
			},
			{
				type: "sheet_metadataUpdate",
				data: {
					name: testState.name,
					characters: {
						remove: [
							{
								...averageMembersFixture[1],
								deleteMethod: {
									mode: DeleteCharacterItemHandlingMethods.setToNobody,
								},
							},
						],
						add: [],
						update: [],
					},
				},
			}
		);
		expect(updatedState.characters).toEqual([averageMembersFixture[0]]);
		expect(updatedState.items).toEqual(
			getCarriedItems(updatedState.items, "Nobody")
		);
	});

	test("Update member", () => {
		const randomUpdate = generateRandomPartyMember({
			id: averageMembersFixture[0].id,
		});
		const updatedState = inventoryReducer(
			{
				...testState,
				characters: [averageMembersFixture[0]],
				//? Generate 2 random inventory items
			},
			{
				type: "sheet_metadataUpdate",
				data: {
					name: testState.name,
					characters: {
						add: [],
						remove: [],
						update: [randomUpdate],
					},
				},
			}
		);
		expect(updatedState.characters).toEqual([
			expect.objectContaining({
				name: randomUpdate.name,
				id: randomUpdate.id,
			}),
		]);
	});

	test("Update multiple characters", () => {
		const randomUpdates = getIds([
			averageMembersFixture[0],
			averageMembersFixture[1],
		]).map((id) => generateRandomPartyMember({ id }));
		const updatedState = inventoryReducer(
			{
				...testState,
				characters: [averageMembersFixture[0], averageMembersFixture[1]],
				//? Generate 2 random inventory items
			},
			{
				type: "sheet_metadataUpdate",
				data: {
					name: testState.name,
					characters: {
						add: [],
						remove: [],
						update: randomUpdates,
					},
				},
			}
		);
		expect(updatedState.characters).toEqual(randomUpdates);
	});
});
