import connectToMongoose from "../../src/db/connectToMongoose";
import dbReducer from "../../src/db/dbReducer";
import SheetModel from "../../src/db/SheetModel";
import InventoryItemFields from "../../src/types/InventoryItemFields";
import InventorySheetFields from "../../src/types/InventorySheetFields";
import mongoose from "mongoose";
import { MockMongoose } from "mock-mongoose";
import {
	AddItemAction,
	InventorySheetPartialUpdateAction,
	UpdateSheetMetaDataAction,
} from "../../src/types/InventorySheetState";
import generateMember from "../../src/generators/generateMember";
import InventoryMemberFields from "../../src/types/InventoryMemberFields";
import { memberIsCarrying } from "../../src/utils/inventoryItemUtils";

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

/**
 * @param data
 */
const dispatchMetaDataUpdate = (data: UpdateSheetMetaDataAction["data"]) =>
	dbReducer(sheetId, {
		type: "sheet_metadataUpdate",
		data,
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

	test("Sheet Metadata Update (name only)", async () => {
		const originalState = await getSheet();

		const testUpdate: UpdateSheetMetaDataAction["data"] = {
			name: originalState.name + "+",
			members: {
				add: [],
				remove: [],
				update: [],
			},
		};

		await dispatchMetaDataUpdate(testUpdate);

		const postUpdateState = await getSheet();

		expect(originalState).not.toMatchObject(postUpdateState);
		expect(originalState.name).not.toEqual(postUpdateState.name);
		expect(postUpdateState.name).toEqual(testUpdate.name);
	});
});

//TODO: Update Member

describe("Metadata Member updates", () => {
	const testMembers: InventoryMemberFields[] = [
		generateMember("1"),
		generateMember("1"),
	];
	test("Add member", async () => {
		const originalState = await getSheet();

		const addMember = testMembers[0];

		await dispatchMetaDataUpdate({
			name: originalState.name,
			members: {
				add: [addMember],
				remove: [],
				update: [],
			},
		});

		const postUpdateState = await getSheet();

		expect(postUpdateState.members.length).toEqual(1);
	});

	test("Remove member - Delete Items", async () => {
		const originalState = await getSheet();

		const removeMember = testMembers[0];

		await dbReducer(sheetId, {
			type: "item_add",
			data: {
				name: "item",
				carriedBy: removeMember._id,
			},
		});
		//? Adding an item that should then be removed when we delete the member

		expect((await getSheet()).items.length).toEqual(1);
		//? We check that the item was added correctly

		await dispatchMetaDataUpdate({
			name: originalState.name,
			members: {
				add: [],
				remove: [
					{
						...removeMember,
						deleteMethod: {
							mode: "remove",
						},
					},
				],
				update: [],
			},
		});
		//? Dispatch the update to remove the member

		const updatedState = await getSheet();

		expect(updatedState.members.length).toEqual(0);
		expect(updatedState.items.length).toEqual(0);
	});

	test("Add multiple members in one update", async () => {
		const originalState = await getSheet();

		await dispatchMetaDataUpdate({
			name: originalState.name,
			members: {
				add: testMembers,
				remove: [],
				update: [],
			},
		});

		const updatedState = await getSheet();

		expect(updatedState.members.length).toEqual(2);
	});

	test("Remove member - Move Items", async () => {
		const originalState = await getSheet();

		const [fromMember, toMember] = testMembers;

		await dispatchMetaDataUpdate({
			name: originalState.name,
			members: {
				add: [fromMember],
				remove: [],
				update: [],
			},
		});

		const numberOfItemsToAdd = 3;
		for (let i = 0; i < numberOfItemsToAdd; i++) {
			await dbReducer(sheetId, {
				type: "item_add",
				data: {
					name: "item" + i,
					carriedBy: fromMember._id,
				},
			});
		}

		expect((await getSheet()).items.length).toEqual(numberOfItemsToAdd);

		await dispatchMetaDataUpdate({
			name: originalState.name,
			members: {
				add: [],
				remove: [
					{
						...fromMember,
						deleteMethod: {
							mode: "move",
							to: toMember._id,
						},
					},
				],
				update: [],
			},
		});

		const multiUpdatedState = await getSheet();

		expect(
			multiUpdatedState.items.filter((item) => memberIsCarrying(toMember, item))
				.length
		).toEqual(numberOfItemsToAdd);
	});

	test("Remove Member - Set To Nobody", async () => {
		const originalState = await getSheet();
		await dispatchMetaDataUpdate({
			name: originalState.name,
			members: {
				add: [],
				remove: [
					{
						...testMembers[1],
						deleteMethod: {
							mode: "setToNobody",
						},
					},
				],
				update: [],
			},
		});

		const updatedState = await getSheet();

		expect(
			updatedState.items.filter((item) => item.carriedBy === "Nobody").length
		).toEqual(
			originalState.items.filter((item) =>
				memberIsCarrying(testMembers[1], item)
			).length
		);
	});
});
