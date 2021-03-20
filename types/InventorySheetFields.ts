import InventoryItemFields from "./InventoryItemFields";

interface InventorySheetFields {
	name: string;
	items: InventoryItemFields[];
	members: string[];
}

export default InventorySheetFields;
