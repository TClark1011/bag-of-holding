/* eslint-disable @typescript-eslint/no-explicit-any */
import { InventorySheetStateAction } from "./../types/InventorySheetState";
import SheetModel from "./SheetModel";

/**
 * Reducer for controlling database
 *
 * @param {string} sheetId The id of the sheet to
 * update
 * @param {object} action The action used to update
 * the sheet
 */
const dbReducer = async (
	sheetId: string,
	action: InventorySheetStateAction
): Promise<void> => {
	const incrementVersion = { $inc: { __v: 1 } };
	if (action.type === "item_add") {
		//# Add An Item
		SheetModel.findByIdAndUpdate(sheetId, {
			$push: { items: action.data },
			...incrementVersion,
		}).exec();
	} else if (action.type === "item_remove") {
		//# Remove An Item
		SheetModel.findByIdAndUpdate(sheetId, {
			$pull: { items: { _id: action.data } } as any,
			...incrementVersion,
		}).exec();
	} else if (action.type === "item_update") {
		//# Update an item
		const update: Record<string, string | number> = {};
		Object.entries(action.data).forEach(([key, value]) => {
			update["items.$." + key] = value;
		});
		//? Create the object that will be used to update the sheet

		SheetModel.updateMany(
			{ _id: sheetId, "items._id": action.data._id } as any,
			{ $set: update, ...incrementVersion } as any
		).exec();
	} else if (action.type === "sheet_metadataUpdate") {
		//# Update sheet metadata
		SheetModel.findByIdAndUpdate(sheetId, {
			$set: { name: action.data.name, members: action.data.members },
			...incrementVersion,
		}).exec();
	}
};

export default dbReducer;
