import mongoose from "mongoose";
import { MONGO_URL } from "../config/env";
import InventorySheetFields from "../types/InventorySheetFields";
import stringifyCopy from "../utils/stringifyCopy";
import SheetModel from "./SheetModel";

mongoose
	.connect(MONGO_URL, { useUnifiedTopology: true, useNewUrlParser: true })
	.then(() => console.log("connected to mongoose"));

/**
 * Fetches all the sheets from the server
 *
 * @returns {Promise<InventorySheetFields[]>} The sheets stored on mongoDB
 */
export const fetchAllSheets = async (): Promise<InventorySheetFields[]> => {
	return stringifyCopy<InventorySheetFields[]>(await SheetModel.find({}));
};

/**
 * Fetch a single sheet
 *
 * @param {string} _id The id of the sheet to fetch
 * @returns {Promise<InventorySheetFields>} The sheet fetched from MongoDB
 */
export const fetchSheet = async (_id: string): Promise<InventorySheetFields> =>
	stringifyCopy<InventorySheetFields>(await SheetModel.findById(_id));

export const updateSheet = async ({
	_id,
	...data
}: InventorySheetFields): Promise<void> => {
	await SheetModel.findByIdAndUpdate(_id, data);
};
