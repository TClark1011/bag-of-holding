import InventoryItemFields from "./InventoryItemFields";

export type InventoryStateActionType = "item_add";

/**
 * Valid types that can be passed into the 'data' field of
 * 'InventoryStateAction' typed objects
 *
 * Valid Types are:
 * - InventoryItemFields - When creating/updating an item, the data should
 * be the all the data for that item.
 * - string - When deleting an item, the '_id' of the item to delete
 */
// export type InventoryStateActionValidData = InventoryItemFields | string;

interface InventoryStateAction {
	type: InventoryStateActionType;
	data: InventoryItemFields;
}

export default InventoryStateAction;
