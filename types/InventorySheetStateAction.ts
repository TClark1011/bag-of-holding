import { InventoryItemCreationFields } from "./InventoryItemFields";

interface InventorySheetStateActionTemplate<T extends string, D> {
	readonly type: T;
	readonly data: D;
}

type InventorySheetStateAddItemAction = InventorySheetStateActionTemplate<
	"item_add",
	InventoryItemCreationFields
>;
type InventorySheetStateRemoveItemAction = InventorySheetStateActionTemplate<
	"item_remove",
	string
>;

type InventorySheetStateAction =
	| InventorySheetStateAddItemAction
	| InventorySheetStateRemoveItemAction;

export default InventorySheetStateAction;
