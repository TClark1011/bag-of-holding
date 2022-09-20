import mongoose, { Schema, model, Model } from "mongoose";
import { UNDERGOING_MIGRATION, inProduction } from "$root/config";
import { SchemaDefinition } from "mongoose";
import composeAllMixedSchema from "$backend/utils/composeAllMixedSchema";

const sheetSchemaDefinition: SchemaDefinition<any> = {
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

const schemaToUse = UNDERGOING_MIGRATION
	? composeAllMixedSchema(sheetSchemaDefinition)
	: sheetSchemaDefinition;
// When undergoing migration, we want to set types to "mixed",
// otherwise mongoose will attempt to parse the data we are
// are migrating using its own parsing logic, which will damage
// the data.

const SheetSchema = new Schema<any>(schemaToUse, {
	timestamps: true,
	strict: !UNDERGOING_MIGRATION,
	// Allow additional keys not specified in the schema if
	// the application is undergoing data migration
});

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
const getSheetModel = (useLiveCollection: boolean = inProduction) => {
	const modelName = getSheetModelName(useLiveCollection);

	const result =
		(mongoose.models[modelName] as Model<any>) || model(modelName, SheetSchema);
	// Get the existing model, if it doesn't exist create a fresh
	// one

	return result;
};

//* Model for accessing the production database
export const ProductionSheetModel = getSheetModel(true);
//? Will always be the production sheet collection regardless of execution environment

const SheetModel = getSheetModel();
//* The sheet model that will be used while the application is running
//? Will be the production model when the application is in production
//? If not in production it will be a detached development database

export default SheetModel;
