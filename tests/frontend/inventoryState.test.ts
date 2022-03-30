import {
	DeleteMemberItemHandlingMethods,
	InventorySheetState,
	InventoryItemFields,
} from "$sheets/types";
import { inventoryReducer } from "$sheets/store";
import { getCarriedItems } from "$sheets/utils";
import { averageMembersFixture } from "../fixtures/membersFixtures";
import {
	generateRandomInventoryItem,
	generateRandomPartyMember,
} from "../utils/randomGenerators";
import tweakString from "../utils/tweakString";
import { getIds } from "$root/utils";

const testState: InventorySheetState = {
	_id: "0",
	name: "Test Sheet",
	members: [],
	items: [],
};

const testItem: InventoryItemFields = {
	_id: "0",
	name: "Test Item",
	quantity: 1,
	weight: 1,
	carriedBy: "Nobody",
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
				data: testItem._id,
			})
		).toMatchObject(testState);
	});

	test("Update Items", () => {
		const newName = testItem.name + "+";
		expect(
			inventoryReducer(testStateWithTestItem, {
				type: "item_update",
				data: {
					_id: testItem._id,
					name: newName,
				},
			})
		).toMatchObject({
			...testState,
			items: [{ ...testItem, name: newName }],
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
	// 				members: [testMember],
	// 			},
	// 		})
	// 	).toMatchObject({ ...testState, name: newName, members: [testMember] });
	// });
});

describe("Metadata updates", () => {
	test("Change sheet name", () => {
		expect(
			inventoryReducer(testState, {
				type: "sheet_metadataUpdate",
				data: {
					name: tweakString(testState.name),
					members: {
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
	test("Add member", () => {
		const updatedState = inventoryReducer(testState, {
			type: "sheet_metadataUpdate",
			data: {
				name: testState.name,
				members: {
					add: [averageMembersFixture[0]],
					update: [],
					remove: [],
				},
			},
		});
		expect(updatedState.members).toEqual([averageMembersFixture[0]]);
	});
	test("Add multiple members", () => {
		const updatedState = inventoryReducer(testState, {
			type: "sheet_metadataUpdate",
			data: {
				name: testState.name,
				members: {
					add: averageMembersFixture,
					update: [],
					remove: [],
				},
			},
		});
		expect(updatedState.members).toEqual(averageMembersFixture);
	});
	test("Remove member (delete item)", () => {
		const updatedState = inventoryReducer(
			{
				...testState,
				members: [averageMembersFixture[0]],
				items: [
					generateRandomInventoryItem({
						carriedBy: averageMembersFixture[0]._id,
					}),
				],
				//? Generate 2 random inventory items
			},
			{
				type: "sheet_metadataUpdate",
				data: {
					name: testState.name,
					members: {
						remove: [
							{
								...averageMembersFixture[0],
								deleteMethod: {
									mode: DeleteMemberItemHandlingMethods.delete,
								},
							},
						],
						add: [],
						update: [],
					},
				},
			}
		);
		expect(updatedState.members).toEqual([]);
		expect(updatedState.items).toEqual([]);
	});
	test("Remove member (delete multiple items)", () => {
		const updatedState = inventoryReducer(
			{
				...testState,
				members: [averageMembersFixture[0]],
				items: Array.from([null, null], () =>
					generateRandomInventoryItem({
						carriedBy: averageMembersFixture[0]._id,
					})
				),
				//? Generate 2 random inventory items
			},
			{
				type: "sheet_metadataUpdate",
				data: {
					name: testState.name,
					members: {
						remove: [
							{
								...averageMembersFixture[0],
								deleteMethod: {
									mode: DeleteMemberItemHandlingMethods.delete,
								},
							},
						],
						add: [],
						update: [],
					},
				},
			}
		);
		expect(updatedState.members).toEqual([]);
		expect(updatedState.items).toEqual([]);
	});
	test("Remove member (give item)", () => {
		const updatedState = inventoryReducer(
			{
				...testState,
				members: [averageMembersFixture[0], averageMembersFixture[1]],
				items: [
					generateRandomInventoryItem({
						carriedBy: averageMembersFixture[1]._id,
					}),
				],
				//? Generate 2 random inventory items
			},
			{
				type: "sheet_metadataUpdate",
				data: {
					name: testState.name,
					members: {
						remove: [
							{
								...averageMembersFixture[1],
								deleteMethod: {
									mode: DeleteMemberItemHandlingMethods.give,
									to: averageMembersFixture[0]._id,
								},
							},
						],
						add: [],
						update: [],
					},
				},
			}
		);
		expect(updatedState.members).toEqual([averageMembersFixture[0]]);
		expect(updatedState.items.length).toEqual(1);
		expect(updatedState.items[0].carriedBy).toEqual(
			averageMembersFixture[0]._id
		);
	});
	test("Remove member (give multiple items)", () => {
		const updatedState = inventoryReducer(
			{
				...testState,
				members: [averageMembersFixture[0], averageMembersFixture[1]],
				items: Array.from([null, null], () =>
					generateRandomInventoryItem({
						carriedBy: averageMembersFixture[1]._id,
					})
				),
				//? Generate 2 random inventory items
			},
			{
				type: "sheet_metadataUpdate",
				data: {
					name: testState.name,
					members: {
						remove: [
							{
								...averageMembersFixture[1],
								deleteMethod: {
									mode: DeleteMemberItemHandlingMethods.give,
									to: averageMembersFixture[0]._id,
								},
							},
						],
						add: [],
						update: [],
					},
				},
			}
		);
		expect(updatedState.members).toEqual([averageMembersFixture[0]]);
		expect(updatedState.items).toEqual(
			getCarriedItems(updatedState.items, averageMembersFixture[0])
		);
	});
	test("Remove member (mark item as carried by nobody)", () => {
		const updatedState = inventoryReducer(
			{
				...testState,
				members: [averageMembersFixture[0]],
				items: [
					generateRandomInventoryItem({
						carriedBy: averageMembersFixture[0]._id,
					}),
				],
				//? Generate 2 random inventory items
			},
			{
				type: "sheet_metadataUpdate",
				data: {
					name: testState.name,
					members: {
						remove: [
							{
								...averageMembersFixture[0],
								deleteMethod: {
									mode: DeleteMemberItemHandlingMethods.setToNobody,
								},
							},
						],
						add: [],
						update: [],
					},
				},
			}
		);
		expect(updatedState.members).toEqual([]);
		expect(updatedState.items.length).toEqual(1);
		expect(updatedState.items[0].carriedBy).toEqual("Nobody");
	});

	test("Remove member (mark multiple items as carried by nobody)", () => {
		const updatedState = inventoryReducer(
			{
				...testState,
				members: [averageMembersFixture[0], averageMembersFixture[1]],
				items: Array.from([null, null], () =>
					generateRandomInventoryItem({
						carriedBy: averageMembersFixture[1]._id,
					})
				),
				//? Generate 2 random inventory items
			},
			{
				type: "sheet_metadataUpdate",
				data: {
					name: testState.name,
					members: {
						remove: [
							{
								...averageMembersFixture[1],
								deleteMethod: {
									mode: DeleteMemberItemHandlingMethods.setToNobody,
								},
							},
						],
						add: [],
						update: [],
					},
				},
			}
		);
		expect(updatedState.members).toEqual([averageMembersFixture[0]]);
		expect(updatedState.items).toEqual(
			getCarriedItems(updatedState.items, "Nobody")
		);
	});

	test("Update member", () => {
		const randomUpdate = generateRandomPartyMember({
			_id: averageMembersFixture[0]._id,
		});
		const updatedState = inventoryReducer(
			{
				...testState,
				members: [averageMembersFixture[0]],
				//? Generate 2 random inventory items
			},
			{
				type: "sheet_metadataUpdate",
				data: {
					name: testState.name,
					members: {
						add: [],
						remove: [],
						update: [randomUpdate],
					},
				},
			}
		);
		expect(updatedState.members).toEqual([randomUpdate]);
	});
	test("Update multiple members", () => {
		const randomUpdates = getIds([
			averageMembersFixture[0],
			averageMembersFixture[1],
		]).map((_id) => generateRandomPartyMember({ _id }));
		const updatedState = inventoryReducer(
			{
				...testState,
				members: [averageMembersFixture[0], averageMembersFixture[1]],
				//? Generate 2 random inventory items
			},
			{
				type: "sheet_metadataUpdate",
				data: {
					name: testState.name,
					members: {
						add: [],
						remove: [],
						update: randomUpdates,
					},
				},
			}
		);
		expect(updatedState.members).toEqual(randomUpdates);
	});
});
