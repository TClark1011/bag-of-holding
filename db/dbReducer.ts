import { InventorySheetStateAction } from "./../types/InventorySheetState";
import InventorySheetState from "../types/InventorySheetState";
import SheetModel from "./SheetModel";

/**
 * Reducer for controlling database
 *
 * @param state
 * @param sheetId
 * @param action
 */
const dbReducer = async (
	sheetId: string,
	action: InventorySheetStateAction
): Promise<void> => {
	if (action.type === "item_add") {
		console.log("(dbReducer) dbReducer received item_add action!");

		SheetModel.findByIdAndUpdate(sheetId, {
			$push: { items: action.data },
		}).exec();
	} else if (action.type === "item_remove") {
		SheetModel.findByIdAndUpdate(sheetId, {
			$pull: { items: { _id: action.data } } as any,
		}).exec();
	} else if (action.type === "item_update") {
		const update: Record<string, string | number> = {};
		Object.entries(action.data).forEach(([key, value]) => {
			update["items.$." + key] = value;
		});
		SheetModel.updateMany(
			{ _id: sheetId, "items._id": action.data._id } as any,
			{ $set: update } as any
		).exec();
	} else if (action.type === "sheet_metadataUpdate") {
		SheetModel.findByIdAndUpdate(sheetId, {
			$set: { name: action.data.name, members: action.data.members },
		}).exec();
	}
};

export default dbReducer;
