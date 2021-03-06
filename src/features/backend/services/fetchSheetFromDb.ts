import { InventorySheetFields } from "$sheets/types";
import { connectToMongoose } from "$backend/utils";
import { stringifyCopy } from "$root/utils";
import { SheetModel } from "$backend/models";

connectToMongoose();

/**
 * Fetch a sheet with the provided ID from mongodb
 *
 * @param _id The '_id' of the sheet to fetch
 * @returns The fetched
 * sheet
 */
const fetchSheetFromDb = async (_id: string): Promise<InventorySheetFields> =>
	stringifyCopy<InventorySheetFields>(await SheetModel.findById(_id));

export default fetchSheetFromDb;
