import InventoryItemFields from "./InventoryItemFields";
import InventoryMemberFields from "./InventoryMemberFields";

interface InventorySheetFields {
	readonly _id: string;
	name: string;
	items: InventoryItemFields[];
	members: InventoryMemberFields[];
}
//? name max length (max length: 24 chars)

export interface InventorySheetMenuItemFields
	extends Omit<InventorySheetFields, "items"> {
	lastAccessedAt: Date;
}

export default InventorySheetFields;
