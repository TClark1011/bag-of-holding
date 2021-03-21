import { InventoryItemCreationFields } from "./InventoryItemFields";

interface InventorySheetStateActionTemplate<T extends string, D> {
	readonly type: T;
	readonly data: D;
}

type AddItemAction = InventorySheetStateActionTemplate<
	"item_add",
	InventoryItemCreationFields
>;
type RemoveItemAction = InventorySheetStateActionTemplate<
	"item_remove",
	string
>;

export type InventorySheetStateAction = AddItemAction | RemoveItemAction;
