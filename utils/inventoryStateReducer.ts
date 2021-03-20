import produce from "immer";
import InventoryItemFields from "../types/InventoryItemFields";
import InventoryStateAction from "../types/InventoryStateAction";

/**
 * The reducer for a sheet's inventory state
 *
 * @param {InventoryItemFields[]} state The current state of the inventory
 * @param {InventoryStateAction} action The action to be performed upon the state
 * @param {InventoryStateActionType} action.type The type of action being performed
 * @param {InventoryStateActionValidData} action.data Supplementary information
 * about how the action should be executed
 * @returns {InventoryItemFields[]} The state updated by the passed action
 */
const inventoryStateReducer = (
	state: InventoryItemFields[],
	{ type, data }: InventoryStateAction
): InventoryItemFields[] => {
	switch (type) {
		case "item_add":
			return produce(state, (draftState) => {
				draftState.push(data as InventoryItemFields);
			});
	}
};

export default inventoryStateReducer;
