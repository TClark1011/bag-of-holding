import mongoose from "mongoose";

const SheetSchema = new mongoose.Schema({
	name: { type: String, required: true },
	members: { type: [String] },
	items: [
		{
			_id: { type: String, required: true },
			name: { type: String, required: true },
			category: { type: String },
			value: { type: Number },
			weight: { type: Number },
			quantity: { type: Number },
			carriedBy: { type: String },
		},
	],
});

const SheetModel =
	mongoose.models.sheet || mongoose.model<ISheet>("sheet", SheetSchema);
