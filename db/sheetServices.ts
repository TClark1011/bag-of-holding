import mongoose from "mongoose";
import { MONGO_URL } from "../config/env";
import InventorySheetFields from "../types/InventorySheetFields";
import stringifyCopy from "../utils/stringifyCopy";
import SheetModel from "./SheetModel";

mongoose
	.connect(MONGO_URL, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useFindAndModify: false,
	})
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
export const fetchSheet = async (
	_id: string
): Promise<InventorySheetFields> => {
	/**
	 * //FIXME: This is throwing an error about "resolving without sending a response"
	 * Moving this code out of this function and simply executing it inline still produces the problem
	 * I think it might be a problem with using mongoose in NextJS. It doesn't seem to be actually affecting
	 * application.
	 */
	return stringifyCopy<InventorySheetFields>(await SheetModel.findById(_id));
};

/**
 * Update a sheet
 *
 * @param {InventorySheetFields} data The data to update the sheet with
 */
export const updateSheet = async ({
	_id,
	...data
}: InventorySheetFields): Promise<void> => {
	await SheetModel.findByIdAndUpdate(_id, data);
};
