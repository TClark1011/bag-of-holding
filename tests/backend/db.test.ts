import connectToMongoose from "../../src/db/connectToMongoose";
import dbReducer from "../../src/db/dbReducer";
import SheetModel from "../../src/db/SheetModel";
import InventoryItemFields from "../../src/types/InventoryItemFields";
import InventorySheetFields from "../../src/types/InventorySheetFields";
import mongoose from "mongoose";
import { MockMongoose } from "mock-mongoose";
import {
	InventorySheetPartialUpdateAction,
	UpdateSheetMetaDataAction,
} from "../../src/types/InventorySheetState";
import generateMember from "../../src/generators/generateMember";
import InventoryMemberFields from "../../src/types/InventoryMemberFields";
import { OmitId } from "../../src/types/UtilityTypes";
import {
	healthPotionFixture,
	longswordFixture,
} from "../fixtures/itemFixtures";
import { merge } from "merge-anything";
import { memberIsCarrying } from "../../src/utils/inventoryItemUtils";
import getCarriedItems from "../../src/utils/getCarriedItems";
import tweakString from "../utils/tweakString";

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
 * Function for generating a new sheet for testing.
 * Sheet is deleted once tests are completed
 *
 * @param {Function} testFn A callback containing tests
 * to be executed. The callback is passed::
 * - initialState: The state of sheet as it was created
 * - update: A function to dispatch actions on that sheet
 * and then return the updated state
 * @param {object} [initialStateTweaks={}] An object which
 * is merged with a basic sheet inventory state to derive
 * derive the starting state of the sheet. The basic initial
 * sheet has the name "name" and no members or items.
 */
const testDbReducer = async (
	testFn: (
		initialState: InventorySheetFields,
		update: (
			action: InventorySheetPartialUpdateAction
		) => Promise<InventorySheetFields>
	) => Promise<void>,
	initialStateTweaks: Partial<OmitId<InventorySheetFields>> = {}
): Promise<void> => {
	const newSheet = await new SheetModel(
		merge(
			{
				name: "name",
				members: [],
				items: [],
			},
			initialStateTweaks
		)
	).save();

	/**
	 * Update the sheet via an action and return the
	 * updated state
	 *
	 * @param {object} action The action to execute
	 * upon th sheet.
	 * @returns {Promise<object>} The state of the sheet
	 * after the action has been executed.
	 */
	const update = async (action: InventorySheetPartialUpdateAction) => {
		await dbReducer((newSheet._id as unknown) as string, action);
		return (await (SheetModel.findById(
			(newSheet._id as unknown) as string
		) as unknown)) as InventorySheetFields;
	};
	await testFn((newSheet as unknown) as InventorySheetFields, update);
	await newSheet.delete();
};

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

	/**
	 * @param member
	 * @param member2
	 */
	const getTestItems = (member: InventoryMemberFields, member2 = member) => [
		{ ...longswordFixture, carriedBy: member._id },
		{ ...healthPotionFixture, carriedBy: member2._id },
	];

	test("Add member", () =>
		testDbReducer(async (originalState, update) => {
			const updated = await update({
				type: "sheet_metadataUpdate",
				data: {
					name: originalState.name,
					members: { add: [testMembers[0]], remove: [], update: [] },
				},
			});
			expect(updated.members.length).toEqual(1);
		}));
	test("Add multiple members", () =>
		testDbReducer(async (originalState, update) => {
			const updated = await update({
				type: "sheet_metadataUpdate",
				data: {
					name: originalState.name,
					members: { add: testMembers, remove: [], update: [] },
				},
			});
			expect(updated.members.length).toEqual(testMembers.length);
		}));

	test("Remove member - Remove item", () =>
		testDbReducer(
			async (originalState, update) => {
				//FIXME: This test always passes even with `expect(false).toBeTruthy();`
				expect(originalState.items.length).toEqual(1);

				const updated = await update({
					type: "sheet_metadataUpdate",
					data: {
						name: originalState.name,
						members: {
							add: [],
							remove: [
								{
									...testMembers[0],
									deleteMethod: {
										mode: "remove",
									},
								},
							],
							update: [],
						},
					},
				});
				expect(updated.items.length).toEqual(0);
			},
			{
				members: [testMembers[0]],
				items: [getTestItems(testMembers[0])[0]],
			}
		));

	test("Remove member - Remove multiple items", () =>
		testDbReducer(
			async (originalState, update) => {
				expect(originalState.items.length).toEqual(2);

				const updated = await update({
					type: "sheet_metadataUpdate",
					data: {
						name: originalState.name,
						members: {
							add: [],
							remove: [
								{
									...testMembers[0],
									deleteMethod: {
										mode: "remove",
									},
								},
							],
							update: [],
						},
					},
				});
				expect(updated.items.length).toEqual(0);
			},
			{
				members: [testMembers[0]],
				items: getTestItems(testMembers[0]),
			}
		));
	test("Remove member - Move item to another member", () =>
		testDbReducer(
			async (originalState, update) => {
				expect(originalState.items.length).toEqual(2);

				const updated = await update({
					type: "sheet_metadataUpdate",
					data: {
						name: originalState.name,
						members: {
							add: [],
							remove: [
								{
									...testMembers[0],
									deleteMethod: {
										mode: "move",
										to: testMembers[1]._id,
									},
								},
							],
							update: [],
						},
					},
				});
				expect(updated.items.length).toEqual(2);
				expect(updated.items).toEqual(
					getCarriedItems(updated.items, testMembers[1])
				);
			},
			{
				members: [testMembers[0], testMembers[1]],
				items: getTestItems(testMembers[0], testMembers[1]),
			}
		));
	test("Remove member - Move multiple items to another member", () =>
		testDbReducer(
			async (originalState, update) => {
				expect(originalState.items.length).toEqual(3);
				expect(
					getCarriedItems(originalState.items, testMembers[0]).length
				).toEqual(1);
				expect(
					getCarriedItems(originalState.items, testMembers[1]).length
				).toEqual(2);

				const updated = await update({
					type: "sheet_metadataUpdate",
					data: {
						name: originalState.name,
						members: {
							add: [],
							remove: [
								{
									...testMembers[1],
									deleteMethod: {
										mode: "move",
										to: testMembers[0]._id,
									},
								},
							],
							update: [],
						},
					},
				});
				expect(updated.items.length).toEqual(3);
				expect(updated.items).toEqual(
					getCarriedItems(updated.items, testMembers[0])
				);
			},
			{
				members: [testMembers[0], testMembers[1]],
				items: [
					{
						_id: "1",
						name: " ",
						quantity: 1,
						weight: 1,
						carriedBy: testMembers[0]._id,
					},
					{
						_id: "2",
						name: " ",
						quantity: 1,
						weight: 1,
						carriedBy: testMembers[1]._id,
					},
					{
						_id: "3",
						name: " ",
						quantity: 1,
						weight: 1,
						carriedBy: testMembers[1]._id,
					},
				],
			}
		));

	test("Remove member - Set to nobody", () =>
		testDbReducer(
			async (originalState, update) => {
				expect(originalState.items.length).toEqual(1);

				const updated = await update({
					type: "sheet_metadataUpdate",
					data: {
						name: originalState.name,
						members: {
							add: [],
							remove: [
								{
									...testMembers[0],
									deleteMethod: {
										mode: "setToNobody",
									},
								},
							],
							update: [],
						},
					},
				});
				expect(updated.items.length).toEqual(1);
				expect(updated.items).toEqual(getCarriedItems(updated.items, "Nobody"));
			},
			{
				members: [testMembers[0]],
				items: [getTestItems(testMembers[0])[0]],
			}
		));
	test("Remove member - Set multiple to nobody", () =>
		testDbReducer(
			async (originalState, update) => {
				expect(originalState.items.length).toEqual(2);

				const updated = await update({
					type: "sheet_metadataUpdate",
					data: {
						name: originalState.name,
						members: {
							add: [],
							remove: [
								{
									...testMembers[0],
									deleteMethod: {
										mode: "setToNobody",
									},
								},
							],
							update: [],
						},
					},
				});
				expect(updated.items.length).toEqual(originalState.items.length);
				expect(updated.items).toEqual(getCarriedItems(updated.items, "Nobody"));
			},
			{
				members: [testMembers[0]],
				items: getTestItems(testMembers[0]),
			}
		));
	test("Update member", () =>
		testDbReducer(
			async (originalState, update) => {
				const updated = await update({
					type: "sheet_metadataUpdate",
					data: {
						name: originalState.name,
						members: {
							add: [],
							remove: [],
							update: [
								{
									...testMembers[0],
									name: tweakString(testMembers[0].name),
								},
							],
						},
					},
				});
				expect(updated.members).not.toEqual(originalState.members);
				expect(updated.members.length).toEqual(originalState.members.length);
				expect(updated.members[0].name).toEqual(
					tweakString(testMembers[0].name)
				);
			},
			{
				members: [testMembers[0]],
			}
		));
	test("Update multiple members", () =>
		testDbReducer(
			async (originalState, update) => {
				const updated = await update({
					type: "sheet_metadataUpdate",
					data: {
						name: originalState.name,
						members: {
							add: [],
							remove: [],
							update: testMembers.map(({ name, ...mem }) => ({
								...mem,
								name: tweakString(name),
							})),
						},
					},
				});

				expect(updated.members).not.toEqual(originalState.members);
				expect(updated.members.length).toEqual(originalState.members.length);
				expect(updated.members.map((m) => m.name)).toEqual(
					originalState.members.map((m) => tweakString(m.name))
				);
			},
			{
				members: testMembers,
			}
		));
});
