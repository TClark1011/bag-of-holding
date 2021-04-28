import { inProduction } from "../config/publicEnv";
import mongoose, { Model, Document } from "mongoose";
import InventorySheetFields from "../types/InventorySheetFields";

const SheetSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		members: [
			{
				_id: { type: String, required: true },
				name: { type: String, required: true },
				carryCapacity: { type: Number, default: 0 },
			},
		],
		items: [
			{
				_id: { type: String, required: true },
				name: { type: String, required: true },
				description: { type: String },
				category: { type: String },
				value: { type: Number },
				weight: { type: Number },
				quantity: { type: Number },
				carriedBy: { type: String },
				reference: { type: String },
			},
		],
	},
	{ timestamps: true }
);

/**
 * Get the name to use for the sheet model depending on if
 * the application is being run in production mode or not
 *
 * @param {boolean} useLiveCollection Whether or not to get
 * the name of the collection used in the live version of
 * the application. Defaults to the value of 'inProduction'
 * @returns {string} The name to use for the sheet collection
 * in mongodb
 */
export const getSheetModelName = (useLiveCollection: boolean): string =>
	(useLiveCollection ? "" : "dev-") + "sheet";

/**
 * Fetch the sheet model controller object from MongoDB
 *
 * @param {boolean} [useLiveCollection] Whether or not to get
 * the name of the collection used in the live version of
 * the application. Defaults to the value of 'inProduction'.
 * Gets passed to 'getSheetModelName'
 * @returns {object} The object for controlling the sheet collection
 */
const getSheetModel = (useLiveCollection: boolean = inProduction) =>
	(mongoose.models[getSheetModelName(useLiveCollection)] as Model<
		Document<InventorySheetFields>
	>) ||
	mongoose.model<Document<InventorySheetFields>>(
		getSheetModelName(useLiveCollection),
		SheetSchema
	);

//* Model for accessing the production database
export const ProductionSheetModel = getSheetModel(true);
//? Will always be the production sheet collection regardless of execution environment

//* The sheet model that will be used while the application is running
export default getSheetModel();
//? Will be the production model when the application is in production
//? If not in production it will be a detached development database
