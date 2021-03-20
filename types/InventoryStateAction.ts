import InventoryItemFields from "./InventoryItemFields";
interface InventoryStateActionTemplate<T extends string, D> {
	readonly type: T;
	readonly data: D;
}

type InventoryStateAddItemAction = InventoryStateActionTemplate<
	"item_add",
	InventoryItemFields
>;
type InventoryStateRemoveItemAction = InventoryStateActionTemplate<
	"item_remove",
	string
>;

type InventoryStateAction =
	| InventoryStateAddItemAction
	| InventoryStateRemoveItemAction;

export default InventoryStateAction;
