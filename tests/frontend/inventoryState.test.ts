import { merge } from "merge-anything";
import generateMember from "../../src/generators/generateMember";
import inventoryReducer from "../../src/state/inventoryReducer";
import InventoryItemFields from "../../src/types/InventoryItemFields";
import InventoryMemberFields from "../../src/types/InventoryMemberFields";
import InventorySheetState from "../../src/types/InventorySheetState";

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

const testMember: InventoryMemberFields = generateMember("Test Member");

const testStateWithTestMember = { ...testState, members: [testMember] };

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

	test("Metadata Update (sheet name only)", () => {
		const newName = testState.name + "+";
		expect(
			inventoryReducer(testState, {
				type: "sheet_metadataUpdate",
				data: {
					name: newName,
					members: { add: [], remove: [], update: [] },
				},
			})
		).toMatchObject({ ...testState, name: newName });
	});
});

describe("Metadata Member Updates", () => {
	test("Add Member", () => {
		expect(
			inventoryReducer(testState, {
				type: "sheet_metadataUpdate",
				data: {
					name: testState.name,
					members: { add: [testMember], remove: [], update: [] },
				},
			})
		).toMatchObject(testStateWithTestMember);
	});

	test("Remove Member", () => {
		expect(
			inventoryReducer(testStateWithTestMember, {
				type: "sheet_metadataUpdate",
				data: {
					name: testStateWithTestMember.name,
					members: {
						add: [],
						remove: [testMember],
						update: [],
					},
				},
			})
		).toMatchObject(testState);
	});

	test("Update Member", () => {
		expect(
			inventoryReducer(testStateWithTestMember, {
				type: "sheet_metadataUpdate",
				data: {
					name: testStateWithTestMember.name,
					members: {
						add: [],
						remove: [],
						update: [{ ...testMember, name: testMember.name + "+" }],
					},
				},
			})
		).toMatchObject(
			merge(testStateWithTestMember, {
				members: [{ name: testMember.name + "+" }],
			})
		);
	});

	test("All", () => {
		const existingMembers = [
			generateMember("1"),
			generateMember("2"),
			generateMember("3"),
		];
		//? Members that will already be in the sheet before the update
		const member2Update = {
			...existingMembers[1],
			name: existingMembers[1] + "+",
		};
		//? Update that will be applied to the second member
		const memberToAdd = generateMember("4");
		//? Member that will be added to the sheet
		expect(
			inventoryReducer(
				{ ...testState, members: existingMembers },
				{
					type: "sheet_metadataUpdate",
					data: {
						name: testState.name,
						members: {
							add: [memberToAdd],
							remove: [existingMembers[2]],
							update: [member2Update],
						},
					},
				}
				//? We update the second member, delete the third, and then add a new member
			)
		).toMatchObject({
			...testState,
			members: [existingMembers[0], member2Update, memberToAdd],
		});
	});
});
