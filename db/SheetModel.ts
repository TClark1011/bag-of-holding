import { inProduction } from "./../config/publicEnv";
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

/**
 * @param useLiveCollection
 */
export const getSheetModelName = (useLiveCollection = inProduction): string =>
	(useLiveCollection ? "" : "dev-") + "sheet";

const SheetModel =
	(mongoose.models[getSheetModelName()] as Model<
		Document<InventorySheetFields>
	>) ||
	mongoose.model<Document<InventorySheetFields>>(
		getSheetModelName(),
		SheetSchema
	);

export default SheetModel;
