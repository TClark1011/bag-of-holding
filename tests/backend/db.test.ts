import connectToMongoose from "../../db/connectToMongoose";
import dbReducer from "../../db/dbReducer";
import SheetModel from "../../db/SheetModel";
import InventoryItemFields from "../../types/InventoryItemFields";
import InventorySheetFields from "../../types/InventorySheetFields";
import mongoose from "mongoose";

let sheetId = "";

/**
 * Fetch the sheet at the id defined by the 'sheetId'
 * variable
 *
 * @returns {Document<InventorySheetFields>}The SheetModel fetched from mongodb
 */
const getSheet = async () => SheetModel.findById(sheetId);

beforeAll(async () => {
	await connectToMongoose();
	const newSheet = await new SheetModel({
		name: "Sheet Name",
		members: [],
		item: [],
	}).save();

	sheetId = (newSheet._id as unknown) as string;
});

afterAll(async () => {
	await SheetModel.findByIdAndDelete(sheetId);
	//? Delete the sheet after tests are complete

	mongoose.connection.close();
});

describe("Item CRUD", () => {
	const testItem: InventoryItemFields = {
		_id: "id",
		name: "name",
		quantity: 1,
		weight: 1,
	};
	test("Create item", async () => {
		const originalState = ((await getSheet()) as unknown) as InventorySheetFields;
		await dbReducer(sheetId, {
			type: "item_add",
			data: testItem,
		});
		const newState = ((await getSheet()) as unknown) as InventorySheetFields;
		expect(originalState.items.length).toBeLessThan(newState.items.length);
		expect(newState.items[0]).toMatchObject(testItem);
	});

	test("Delete item", async () => {
		await dbReducer(sheetId, {
			type: "item_remove",
			data: testItem._id,
		});
		expect(
			(((await getSheet()) as unknown) as InventorySheetFields).items.length
		).toEqual(0);
	});
});
