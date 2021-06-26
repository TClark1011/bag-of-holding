import InventorySheetFields from "../types/InventorySheetFields";
import connectToMongoose from "./connectToMongoose";
import stringifyCopy from "../utils/stringifyCopy";
import SheetModel from "./SheetModel";

connectToMongoose();

/**
 * Fetch a sheet with the provided ID from mongodb
 *
 * @param {string} _id The '_id' of the sheet to fetch
 * @returns {Promise<InventorySheetFields>} The fetched
 * sheet
 */
const fetchSheetFromDb = async (_id: string): Promise<InventorySheetFields> =>
	stringifyCopy<InventorySheetFields>(await SheetModel.findById(_id));

export default fetchSheetFromDb;
