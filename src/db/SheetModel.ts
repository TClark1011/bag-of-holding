import mongoose, { Model, Document } from "mongoose";
import { InventorySheetFields } from "$sheets/types";
import mapObject from "map-obj";
import { UNDERGOING_MIGRATION, inProduction } from "$root/config";

const sheetSchema = {
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
};

const SheetSchema = new mongoose.Schema(
	UNDERGOING_MIGRATION
		? mapObject(sheetSchema, (key) => [key, {}])
		: sheetSchema,
	//? If the application is undergoing data migration, all fields are set to type "mixed" so that mongoose does not attempt to auto migrate old data to new format
	{
		timestamps: true,
		strict: !UNDERGOING_MIGRATION,
		//? Allow keys not specified in the schema if application is undergoing data migration
	}
);

/**
 * Get the name to use for the sheet model depending on if
 * the application is being run in production mode or not
 *
 * @param useLiveCollection Whether or not to get
 * the name of the collection used in the live version of
 * the application. Defaults to the value of 'inProduction'
 * @returns The name to use for the sheet collection
 * in mongodb
 */
export const getSheetModelName = (useLiveCollection: boolean): string =>
	(useLiveCollection ? "" : "dev-") + "sheet";

/**
 * Fetch the sheet model controller object from MongoDB
 *
 * @param [useLiveCollection] Whether or not to get
 * the name of the collection used in the live version of
 * the application. Defaults to the value of 'inProduction'.
 * Gets passed to 'getSheetModelName'
 * @returns The object for controlling the sheet collection
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
