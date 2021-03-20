import InventoryItemFields from "./InventoryItemFields";

interface InventorySheetFields {
	name: string;
	items: InventoryItemFields[];
	members: string[];
}
//? name max length (max length: 24 chars)

export default InventorySheetFields;
