import connectToMongoose from "../../src/db/connectToMongoose";
import dbReducer from "../../src/db/dbReducer";
import SheetModel from "../../src/db/SheetModel";
import InventoryItemFields from "../../src/types/InventoryItemFields";
import InventorySheetFields from "../../src/types/InventorySheetFields";
import mongoose from "mongoose";
import { MockMongoose } from "mock-mongoose";
import { InventorySheetStateAction } from "../../src/types/InventorySheetState";
import { averageMembersFixture } from "../fixtures/membersFixtures";

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
	JSON.parse(
		JSON.stringify((await SheetModel.findById(sheetId)) as unknown)
	) as InventorySheetFields;
//? We stringify + parse to remove mongoose's extra data fields because they confuse `expect()`

beforeAll(async () => {
	await mockMongoose.prepareStorage().then(() => {
		connectToMongoose();
	});

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
	mongoose.connection.close();
	mockMongoose.killMongo();
});

const testMember = averageMembersFixture[0];

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

	test("Sheet Metadata Update (sheet name only)", async () => {
		const originalState = await getSheet();
		const testUpdate: InventorySheetStateAction["data"] = {
			name: originalState.name + "+",
			members: {
				add: [],
				remove: [],
				update: [],
			},
		};

		await dbReducer(sheetId, {
			type: "sheet_metadataUpdate",
			data: testUpdate,
		});

		const postUpdateState = await getSheet();

		expect(originalState).not.toMatchObject(postUpdateState);
		expect(originalState.name).not.toEqual(postUpdateState.name);
	});
});

describe("Sheet Member Updates", () => {
	test("Add Member", async () => {
		const originalState = await getSheet();

		await dbReducer(sheetId, {
			type: "sheet_metadataUpdate",
			data: {
				name: originalState.name,
				members: {
					add: [testMember],
					remove: [],
					update: [],
				},
			},
		});

		const postUpdateState = await getSheet();

		expect(originalState).not.toMatchObject(postUpdateState);
		expect(postUpdateState.members).toEqual([testMember]);
	});

	test("Update Member", async () => {
		const originalState = await getSheet();

		await dbReducer(sheetId, {
			type: "sheet_metadataUpdate",
			data: {
				name: originalState.name,
				members: {
					add: [],
					remove: [],
					update: [{ ...testMember, name: testMember.name + "+" }],
				},
			},
		});

		const postUpdateState = await getSheet();

		expect(postUpdateState.members).toEqual([
			{
				...originalState.members[0],
				name: originalState.members[0].name + "+",
			},
		]);
	});

	test("Remove Member", async () => {
		const originalState = await getSheet();
		await dbReducer(sheetId, {
			type: "sheet_metadataUpdate",
			data: {
				name: originalState.name,
				members: {
					add: [],
					remove: [testMember],
					update: [],
				},
			},
		});

		const postUpdateState = await getSheet();

		expect(postUpdateState.members).toEqual([]);
	});
});
