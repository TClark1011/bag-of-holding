import InventoryItemFields from "./InventoryItemFields";
import { Document } from "mongoose";

interface InventorySheetFields extends Document {
	name: string;
	items: InventoryItemFields[];
	members: string[];
}
//? name max length (max length: 24 chars)

export default InventorySheetFields;
