import mongoose, { Model, Document } from "mongoose";
import InventorySheetFields from "../types/InventorySheetFields";

const SheetSchema = new mongoose.Schema({
	name: { type: String, required: true },
	members: { type: [String] },
	items: [
		{
			_id: { type: String, required: true },
			name: { type: String, required: true },
			description: { type: String },
			category: { type: String, default: "None" },
			value: { type: Number },
			weight: { type: Number },
			quantity: { type: Number },
			carriedBy: { type: String, default: "Nobody" },
			reference: { type: String },
		},
	],
});

const SheetModel =
	(mongoose.models.sheet as Model<Document<InventorySheetFields>>) ||
	mongoose.model<Document<InventorySheetFields>>("sheet", SheetSchema);

export default SheetModel;
