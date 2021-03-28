import InventoryItemFields from "./InventoryItemFields";

interface InventorySheetFields {
	readonly _id: string;
	name: string;
	items: InventoryItemFields[];
	members: string[];
}
//? name max length (max length: 24 chars)

export type InventorySheetMenuItemFields = Omit<InventorySheetFields, "items">;

export default InventorySheetFields;
