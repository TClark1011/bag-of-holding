import connectToMongoose from "../../src/db/connectToMongoose";
import dbReducer from "../../src/db/dbReducer";
import SheetModel from "../../src/db/SheetModel";
import InventoryItemFields from "../../src/types/InventoryItemFields";
import InventorySheetFields from "../../src/types/InventorySheetFields";
import mongoose from "mongoose";

let sheetId = "";
//? Variable to store the id of the sheet we create for testing

/**
 * Fetch the sheet at the id defined by the 'sheetId'
 * variable
 *
 * @returns {Document<InventorySheetFields>}The SheetModel fetched from mongodb
 */
const getSheet = async () =>
	((await SheetModel.findById(sheetId)) as unknown) as InventorySheetFields;

beforeAll(async () => {
	await connectToMongoose();

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
	await SheetModel.findByIdAndDelete(sheetId);
	//? Delete the sheet after tests are complete

	mongoose.connection.close();
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
		const membersUpdateTest = ["member 1", "member 2"];
		const nameUpdateTest = "updated name";

		const fullUpdateTest = {
			name: "Full Update Name",
			members: [
				"Full Update Member 1",
				"Full Update Member 2",
				"Full Update Member 3",
				"Full Update Member 4",
			],
		};

		//# Update members
		await dbReducer(sheetId, {
			type: "sheet_metadataUpdate",
			data: {
				name: originalState.name,
				members: membersUpdateTest,
			},
		});
		await getSheet();
		//? If I don't include this the next tests
		//FIXME: Make it like not do that pls
		const postMemberUpdateState = await getSheet();
		expect(Array.from(postMemberUpdateState.members)).toEqual(
			membersUpdateTest
		);
		expect(postMemberUpdateState.name).toEqual(originalState.name);

		//# Update sheet name
		await dbReducer(sheetId, {
			type: "sheet_metadataUpdate",
			data: {
				name: nameUpdateTest,
				members: postMemberUpdateState.members,
			},
		});
		await getSheet();
		//? See above
		const postNameUpdateState = await getSheet();
		expect(Array.from(postNameUpdateState.members)).toEqual(
			Array.from(postMemberUpdateState.members)
		);
		expect(postNameUpdateState.name).toEqual(nameUpdateTest);

		//# Update Members and Name
		await dbReducer(sheetId, {
			type: "sheet_metadataUpdate",
			data: fullUpdateTest,
		});
		await getSheet();
		//? See above

		const postFullUpdateState = await getSheet();
		expect(postFullUpdateState).toMatchObject({
			...postNameUpdateState,
			...postFullUpdateState,
		});
	});
});
