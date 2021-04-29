import connectToMongoose from "../../src/db/connectToMongoose";
import dbReducer from "../../src/db/dbReducer";
import SheetModel from "../../src/db/SheetModel";
import InventoryItemFields from "../../src/types/InventoryItemFields";
import InventorySheetFields from "../../src/types/InventorySheetFields";
import mongoose from "mongoose";
import { MockMongoose } from "mock-mongoose";
import { inGitHubAction } from "../../src/config/publicEnv";

let sheetId = "";
//? Variable to store the id of the sheet we create for testing

const mockMongoose = new MockMongoose(mongoose);

/**
 * Fetch the sheet at the id defined by the 'sheetId'
 * variable
 *
 * @returns {Document<InventorySheetFields>}The SheetModel fetched from mongodb
 */
const getSheet = async () =>
	((await SheetModel.findById(sheetId)) as unknown) as InventorySheetFields;

beforeAll(async () => {
	if (!inGitHubAction) {
		await mockMongoose.prepareStorage().then(async () => {
			console.log(
				"mockMongoose prepareStorage callback: will now start connecting to mongoose"
			);
			await connectToMongoose();
		});
	} else {
		await connectToMongoose();
	}

	const newSheet = await new SheetModel({
		name: "Sheet Name",
		members: [],
		items: [],
	}).save();
	//? Create a new sheet

	sheetId = (newSheet._id as unknown) as string;
	//? Save the id of the newly created sheet into the 'sheetId' variable
});

afterAll(async () => {
	try {
		await mongoose.connection.close();

		if (inGitHubAction) {
			await mockMongoose.killMongo();
		}
	} catch (e) {
		console.log("mongoose connection close commands failed");
	}
});

describe("DB Reducer Actions", () => {
	const testItem: InventoryItemFields = {
		_id: "id",
		name: "name",
		quantity: 1,
		weight: 1,
	};
	test("Create item", async () => {
		const originalState = await getSheet();
		await dbReducer(sheetId, {
			type: "item_add",
			data: testItem,
		});
		const newState = await getSheet();
		expect(originalState.items.length).toBeLessThan(newState.items.length);
		expect(newState.items[0]).toMatchObject(testItem);
	});

	test("Update item", async () => {
		const updateItemNameTest = "updated item name";
		await dbReducer(sheetId, {
			type: "item_update",
			data: {
				_id: testItem._id,
				name: updateItemNameTest,
			},
		});
		expect((await getSheet()).items[0]).toMatchObject({
			...testItem,
			name: updateItemNameTest,
		});
	});

	test("Delete item", async () => {
		await dbReducer(sheetId, {
			type: "item_remove",
			data: testItem._id,
		});
		expect((await getSheet()).items.length).toEqual(0);
	});

	test("Sheet Metadata Update", async () => {
		const originalState = await getSheet();
		const testUpdate = {
			name: originalState.name + "+",
			members: ["1", "2"],
		};

		await dbReducer(sheetId, {
			type: "sheet_metadataUpdate",
			data: testUpdate,
		});

		const postUpdateState = await getSheet();

		expect(originalState).not.toMatchObject(postUpdateState);
		expect(originalState.members.length).toBeLessThan(
			postUpdateState.members.length
		);
		expect(originalState.name).not.toEqual(postUpdateState.name);
	});
});
