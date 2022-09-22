import { DeleteCharacterItemHandlingMethods } from "$sheets/types";
import tweakString from "../utils/tweakString";
import prisma from "$prisma";
import dbReducer from "$backend/dbReducer";
import { D } from "@mobily/ts-belt";
import faker from "faker";
import { generateRandomInventoryItem } from "$tests/utils/randomGenerators";

describe("DB Reducer Actions", () => {
	test("Create item", async () => {
		const baseSheet = await prisma.sheet.create({
			data: {
				name: "name",
			},
			include: {
				items: true,
			},
		});
		const { id, ...newItem } = generateRandomInventoryItem({
			sheetId: baseSheet.id,
		});
		await dbReducer(baseSheet.id, {
			type: "item_add",
			data: newItem,
		});
		const updatedSheet = await prisma.sheet.findFirstOrThrow({
			where: {
				id: baseSheet.id,
			},
			include: {
				items: true,
			},
		});
		expect(baseSheet.items).toHaveLength(0);
		expect(updatedSheet.items).toHaveLength(1);
		expect(newItem).toMatchObject(D.deleteKey(updatedSheet.items[0], "id"));
	});

	test("Update item", async () => {
		const baseItemName = "Item Name";
		const updatedItemName = tweakString(baseItemName);

		const { sheetId, id, ...testItem } = generateRandomInventoryItem({
			name: baseItemName,
		});

		const baseSheet = await prisma.sheet.create({
			data: {
				name: "name",
				items: {
					create: [testItem],
				},
			},
			include: {
				items: true,
			},
		});

		await dbReducer(baseSheet.id, {
			type: "item_update",
			data: {
				id: baseSheet.items[0].id,
				name: updatedItemName,
			},
		});

		const updatedSheet = await prisma.sheet.findFirstOrThrow({
			where: {
				id: baseSheet.id,
			},
			include: {
				items: true,
			},
		});

		expect(baseSheet.items).toHaveLength(1);
		expect(updatedSheet.items).toHaveLength(1);

		expect(baseSheet.items[0].name).toBe(baseItemName);
		expect(updatedSheet.items[0].name).toBe(updatedItemName);
	});

	test("Delete item", async () => {
		const { sheetId, id, ...testItem } = generateRandomInventoryItem();
		const baseSheet = await prisma.sheet.create({
			data: {
				name: "name",
				items: {
					create: [testItem],
				},
			},
			include: {
				items: true,
			},
		});

		await dbReducer(baseSheet.id, {
			type: "item_remove",
			data: baseSheet.items[0].id,
		});

		const updatedSheet = await prisma.sheet.findFirstOrThrow({
			where: {
				id: baseSheet.id,
			},
			include: {
				items: true,
			},
		});

		expect(baseSheet.items).toHaveLength(1);
		expect(updatedSheet.items).toHaveLength(0);
		expect(D.deleteKeys(updatedSheet.items[0], ["id", "sheetId"]));
	});

	test("Sheet Metadata Update (name only)", async () => {
		const baseSheet = await prisma.sheet.create({
			data: {
				name: "name",
			},
		});

		await dbReducer(baseSheet.id, {
			type: "sheet_metadataUpdate",
			data: {
				name: "name+",
			},
		});

		const updatedSheet = await prisma.sheet.findFirstOrThrow({
			where: {
				id: baseSheet.id,
			},
		});

		expect(baseSheet.name).toBe("name");
		expect(updatedSheet.name).toBe("name+");
	});
});

describe("Metadata Member updates", () => {
	test("Add member", async () => {
		const baseSheet = await prisma.sheet.create({
			data: {
				name: "name",
			},
			include: {
				characters: true,
			},
		});

		await dbReducer(baseSheet.id, {
			type: "sheet_metadataUpdate",
			data: {
				characters: {
					add: [
						{
							carryCapacity: 0,
							name: "character name",
						},
					],
				},
			},
		});

		const updatedSheet = await prisma.sheet.findFirstOrThrow({
			where: {
				id: baseSheet.id,
			},
			include: {
				characters: true,
			},
		});

		expect(baseSheet.characters).toHaveLength(0);
		expect(updatedSheet.characters).toHaveLength(1);
		expect(updatedSheet.characters[0].name).toBe("character name");
	});

	test("Add multiple characters", async () => {
		const baseSheet = await prisma.sheet.create({
			data: {
				name: "name",
			},
			include: {
				characters: true,
			},
		});

		await dbReducer(baseSheet.id, {
			type: "sheet_metadataUpdate",
			data: {
				characters: {
					add: [
						{
							carryCapacity: 0,
							name: "character name",
						},
						{
							carryCapacity: 0,
							name: "character name 2",
						},
					],
				},
			},
		});

		const updatedSheet = await prisma.sheet.findFirstOrThrow({
			where: {
				id: baseSheet.id,
			},
			include: {
				characters: true,
			},
		});

		expect(baseSheet.characters).toHaveLength(0);
		expect(updatedSheet.characters).toHaveLength(2);
		expect(updatedSheet.characters[0].name).toBe("character name");
		expect(updatedSheet.characters[1].name).toBe("character name 2");
	});

	test("Remove member - Remove item", async () => {
		const id = faker.datatype.uuid();
		const baseSheet = await prisma.sheet.create({
			data: {
				name: "name",
				id,
				characters: {
					create: [
						{
							name: "character name",
							carriedItems: {
								create: [
									{
										name: "item name",
										sheetId: id,
									},
								],
							},
						},
					],
				},
			},
			include: {
				characters: true,
				items: true,
			},
		});

		await dbReducer(baseSheet.id, {
			type: "sheet_metadataUpdate",
			data: {
				characters: {
					remove: [
						{
							id: baseSheet.characters[0].id,
							deleteMethod: {
								mode: DeleteCharacterItemHandlingMethods.delete,
							},
						} as never,
					],
				},
			},
		});

		const updatedSheet = await prisma.sheet.findFirstOrThrow({
			where: {
				id: baseSheet.id,
			},
			include: {
				characters: true,
				items: true,
			},
		});

		expect(baseSheet.items).toHaveLength(1);
		expect(baseSheet.characters).toHaveLength(1);

		expect(updatedSheet.items).toHaveLength(0);
		expect(updatedSheet.characters).toHaveLength(0);
	});

	test("Remove member - Remove multiple items", async () => {
		const id = faker.datatype.uuid();

		const itemId1 = faker.datatype.uuid();
		const itemId2 = faker.datatype.uuid();
		const baseSheet = await prisma.sheet.create({
			data: {
				name: "name",
				id,
				characters: {
					create: [
						{
							name: "character name",
							carriedItems: {
								create: [
									{
										name: "item name 1",
										sheetId: id,
										id: itemId1,
									},
									{
										name: "item name 2",
										sheetId: id,
										id: itemId2,
									},
								],
							},
						},
					],
				},
				items: {
					create: [
						{
							name: "item name 3",
						},
					],
				},
			},
			include: {
				characters: true,
				items: true,
			},
		});

		await dbReducer(baseSheet.id, {
			type: "sheet_metadataUpdate",
			data: {
				characters: {
					remove: [
						{
							id: baseSheet.characters[0].id,
							deleteMethod: {
								mode: DeleteCharacterItemHandlingMethods.delete,
							},
						} as never,
					],
				},
			},
		});

		const updatedSheet = await prisma.sheet.findFirstOrThrow({
			where: {
				id: baseSheet.id,
			},
			include: {
				characters: true,
				items: true,
			},
		});

		expect(baseSheet.items).toHaveLength(3);
		expect(baseSheet.characters).toHaveLength(1);

		expect(updatedSheet.items).toHaveLength(1);
		expect(updatedSheet.characters).toHaveLength(0);

		expect(updatedSheet.items[0].name).toBe("item name 3");
	});

	test("Remove member - Move item to another member", async () => {
		const id = faker.datatype.uuid();
		const baseSheet = await prisma.sheet.create({
			data: {
				name: "name",
				id,
				characters: {
					create: [
						{
							name: "character name",
							carriedItems: {
								create: [
									{
										name: "item name",
										sheetId: id,
									},
								],
							},
						},
						{
							name: "character name 2",
						},
					],
				},
			},
			include: {
				characters: true,
				items: true,
			},
		});

		await dbReducer(baseSheet.id, {
			type: "sheet_metadataUpdate",
			data: {
				characters: {
					remove: [
						{
							id: baseSheet.characters[0].id,
							deleteMethod: {
								mode: DeleteCharacterItemHandlingMethods.give,
								to: baseSheet.characters[1].id,
							},
						} as never,
					],
				},
			},
		});

		const updatedSheet = await prisma.sheet.findFirstOrThrow({
			where: {
				id: baseSheet.id,
			},
			include: {
				characters: {
					include: {
						carriedItems: true,
					},
				},
				items: true,
			},
		});

		expect(baseSheet.items).toHaveLength(1);
		expect(baseSheet.characters).toHaveLength(2);

		expect(updatedSheet.items).toHaveLength(1);
		expect(updatedSheet.characters).toHaveLength(1);

		expect(updatedSheet.characters[0].carriedItems).toHaveLength(1);
		expect(updatedSheet.characters[0].carriedItems[0].name).toBe("item name");
	});

	test("Remove member - Move multiple items to another member", async () => {
		const id = faker.datatype.uuid();
		const itemId1 = faker.datatype.uuid();
		const itemId2 = faker.datatype.uuid();
		const baseSheet = await prisma.sheet.create({
			data: {
				name: "name",
				id,
				characters: {
					create: [
						{
							name: "character name",
							carriedItems: {
								create: [
									{
										name: "item name 1",
										sheetId: id,
										id: itemId1,
									},
									{
										name: "item name 2",
										sheetId: id,
										id: itemId2,
									},
								],
							},
						},
						{
							name: "character name 2",
						},
					],
				},
			},
			include: {
				characters: true,
				items: true,
			},
		});

		await dbReducer(baseSheet.id, {
			type: "sheet_metadataUpdate",
			data: {
				characters: {
					remove: [
						{
							id: baseSheet.characters[0].id,
							deleteMethod: {
								mode: DeleteCharacterItemHandlingMethods.give,
								to: baseSheet.characters[1].id,
							},
						} as never,
					],
				},
			},
		});

		const updatedSheet = await prisma.sheet.findFirstOrThrow({
			where: {
				id: baseSheet.id,
			},
			include: {
				characters: {
					include: {
						carriedItems: true,
					},
				},
				items: true,
			},
		});

		expect(baseSheet.items).toHaveLength(2);
		expect(baseSheet.characters).toHaveLength(2);

		expect(updatedSheet.items).toHaveLength(2);
		expect(updatedSheet.characters).toHaveLength(1);

		expect(updatedSheet.characters[0].carriedItems).toHaveLength(2);

		expect(updatedSheet.items).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					name: "item name 1",
				}),
				expect.objectContaining({
					name: "item name 2",
				}),
			])
		);
	});

	test("Remove member - Set to nobody", async () => {
		const id = faker.datatype.uuid();
		const baseSheet = await prisma.sheet.create({
			data: {
				name: "name",
				id,
				characters: {
					create: [
						{
							name: "character name",
							carriedItems: {
								create: [
									{
										name: "item name 1",
										sheetId: id,
									},
								],
							},
						},
					],
				},
			},
			include: {
				characters: true,
				items: true,
			},
		});

		await dbReducer(baseSheet.id, {
			type: "sheet_metadataUpdate",
			data: {
				characters: {
					remove: [
						{
							id: baseSheet.characters[0].id,
							deleteMethod: {
								mode: DeleteCharacterItemHandlingMethods.setToNobody,
							},
						} as never,
					],
				},
			},
		});

		const updatedSheet = await prisma.sheet.findFirstOrThrow({
			where: {
				id: baseSheet.id,
			},
			include: {
				characters: true,
				items: true,
			},
		});

		expect(baseSheet.items).toHaveLength(1);
		expect(baseSheet.characters).toHaveLength(1);

		expect(updatedSheet.items).toHaveLength(1);
		expect(updatedSheet.characters).toHaveLength(0);

		expect(updatedSheet.items[0].carriedByCharacterId).toBeNull();
	});

	test("Remove member - Set multiple to nobody", async () => {
		const id = faker.datatype.uuid();
		const baseSheet = await prisma.sheet.create({
			data: {
				name: "name",
				id,
				characters: {
					create: [
						{
							name: "character name",
							carriedItems: {
								create: [
									{
										name: "item name 1",
										sheetId: id,
									},
									{
										name: "item name 2",
										sheetId: id,
									},
								],
							},
						},
					],
				},
			},
			include: {
				characters: true,
				items: true,
			},
		});

		await dbReducer(baseSheet.id, {
			type: "sheet_metadataUpdate",
			data: {
				characters: {
					remove: [
						{
							id: baseSheet.characters[0].id,
							deleteMethod: {
								mode: DeleteCharacterItemHandlingMethods.setToNobody,
							},
						} as never,
					],
				},
			},
		});

		const updatedSheet = await prisma.sheet.findFirstOrThrow({
			where: {
				id: baseSheet.id,
			},
			include: {
				characters: true,
				items: true,
			},
		});

		expect(baseSheet.items).toHaveLength(2);
		expect(baseSheet.characters).toHaveLength(1);

		expect(updatedSheet.items).toHaveLength(2);
		expect(updatedSheet.characters).toHaveLength(0);

		expect(updatedSheet.items[0].carriedByCharacterId).toBeNull();
		expect(updatedSheet.items[1].carriedByCharacterId).toBeNull();
	});

	test("Update member", async () => {
		const id = faker.datatype.uuid();
		const baseSheet = await prisma.sheet.create({
			data: {
				name: "name",
				id,
				characters: {
					create: [
						{
							name: "character name",
						},
					],
				},
			},
			include: {
				characters: true,
			},
		});

		await dbReducer(baseSheet.id, {
			type: "sheet_metadataUpdate",
			data: {
				characters: {
					update: [
						{
							id: baseSheet.characters[0].id,
							name: "new name",
						},
					],
				},
			},
		});

		const updatedSheet = await prisma.sheet.findFirstOrThrow({
			where: {
				id: baseSheet.id,
			},
			include: {
				characters: true,
			},
		});

		expect(baseSheet.characters).toHaveLength(1);
		expect(updatedSheet.characters).toHaveLength(1);

		expect(updatedSheet.characters[0].name).toBe("new name");
	});

	test("Update multiple characters", async () => {
		const id = faker.datatype.uuid();
		const baseSheet = await prisma.sheet.create({
			data: {
				name: "name",
				id,
				characters: {
					create: [
						{
							name: "character name",
						},
						{
							name: "character name 2",
						},
					],
				},
			},
			include: {
				characters: true,
			},
		});

		await dbReducer(baseSheet.id, {
			type: "sheet_metadataUpdate",
			data: {
				characters: {
					update: [
						{
							id: baseSheet.characters[0].id,
							name: "new name",
						},
						{
							id: baseSheet.characters[1].id,
							name: "new name 2",
						},
					],
				},
			},
		});

		const updatedSheet = await prisma.sheet.findFirstOrThrow({
			where: {
				id: baseSheet.id,
			},
			include: {
				characters: true,
			},
		});

		expect(baseSheet.characters).toHaveLength(2);
		expect(updatedSheet.characters).toHaveLength(2);

		expect(updatedSheet.characters).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: baseSheet.characters[0].id,
					name: "new name",
				}),
				expect.objectContaining({
					id: baseSheet.characters[1].id,
					name: "new name 2",
				}),
			])
		);
	});
});
