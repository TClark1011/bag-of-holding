import { ProductionSheetModel } from "$backend/models";
import connectToMongoose from "$backend/utils/connectToMongoose";
import { getOldSheetCutOff } from "$root/utils";
import { PrismaClient } from "@prisma/client";
import { isAfter } from "date-fns";
import ora from "ora";

const prisma = new PrismaClient();

(async () => {
	await connectToMongoose();

	const fetchSpinner = ora("Fetching Production Sheets").start();

	const sheets = await ProductionSheetModel.find({});

	const relevantSheets = sheets.filter((sheet) =>
		isAfter(sheet.updatedAt, getOldSheetCutOff())
	); //Only grab sheets that are wouldn't qualify for deletion

	fetchSpinner.succeed(`Found ${relevantSheets.length} sheets`);

	let completedSheets = 0;
	const composeMigrationProgressMessage = (completedItems: number) =>
		`Migrated ${completedItems} of ${relevantSheets.length} sheets`;

	const migrationSpinner = ora(composeMigrationProgressMessage(0)).start();

	await Promise.all(
		relevantSheets.map(async (oldSheet) => {
			const sheet = await prisma.sheet.upsert({
				where: {
					id: oldSheet._id.toString(),
				},
				update: { name: oldSheet.name, updatedAt: oldSheet.updatedAt },
				create: {
					id: oldSheet._id.toString(),
					name: oldSheet.name,
					updatedAt: oldSheet.updatedAt,
				},
			});

			// Generate members
			await Promise.all(
				oldSheet.members.map(async (oldMember) =>
					prisma.character
						.create({
							data: {
								name: oldMember.name,
								carryCapacity: oldMember.carryCapacity,
								sheetId: sheet.id,
								carriedItems: {
									createMany: {
										data: oldSheet.items
											.filter(
												(i) =>
													i.carriedBy.toString() === oldMember._id.toString()
											)
											.map((oldItem: any) => ({
												name: oldItem.name,
												description: oldItem.description,
												sheetId: sheet.id,
												category: oldItem.category,
												value: oldItem.value,
												weight: oldItem.weight,
												quantity: oldItem.quantity,
												referenceLink: oldItem.reference,
											})),
									},
								},
							},
						})
						.catch(() => {})
				)
			);

			// Generate Items
			await Promise.all(
				oldSheet.items
					.filter((item) => item.carriedBy === "Nobody")
					.map(async (oldItem) =>
						prisma.item
							.create({
								data: {
									name: oldItem.name,
									description: oldItem.description,
									sheetId: sheet.id,
									category: oldItem.category,
									value: oldItem.value,
									weight: oldItem.weight,
									quantity: oldItem.quantity,
									referenceLink: oldItem.reference,
								},
							})
							.catch(() => {})
					)
			);

			completedSheets += 1;
			migrationSpinner.text = composeMigrationProgressMessage(completedSheets);
		})
	)
		.catch((e) => {
			migrationSpinner.fail("Error");
			console.error(e);
		})
		.then(() => {
			migrationSpinner.succeed();
		});
})().finally(() => {
	process.exit();
});
