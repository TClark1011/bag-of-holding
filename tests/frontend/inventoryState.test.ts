import inventoryReducer from "../../state/inventoryReducer";
import InventoryItemFields from "../../types/InventoryItemFields";
import InventorySheetState from "../../types/InventorySheetState";

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

	test("Metadata Update", () => {
		const newName = testState.name + "+";
		const testMember = "Test Member";
		expect(
			inventoryReducer(testState, {
				type: "sheet_metadataUpdate",
				data: {
					name: newName,
					members: [testMember],
				},
			})
		).toMatchObject({ ...testState, name: newName, members: [testMember] });
	});
});
