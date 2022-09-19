import { SheetModel } from "$backend/models";
import { connectToMongoose } from "$backend/utils";
import { getCarriedItems } from "$sheets/utils";
import { PrismaClient } from "@prisma/client";
import ora from "ora";

const prisma = new PrismaClient();

(async () => {
	await connectToMongoose();

	const fetchSpinner = ora("Fetching Production Sheets").start();
	const sheets = await SheetModel.find({});
	fetchSpinner.succeed(`Found ${sheets.length} sheets`);

	let completedSheets = 0;
	const composeMigrationProgressMessage = (completedItems: number) =>
		`Migrated ${completedItems} of ${sheets.length} sheets`;

	const migrationSpinner = ora(composeMigrationProgressMessage(0)).start();

	await Promise.all(
		sheets.map(async (oldSheet) => {
			const sheet = await prisma.sheet.create({
				data: {
					name: oldSheet.name,
				},
			});

			// Generate members
			await Promise.all(
				oldSheet.members.map(async (oldMember) =>
					prisma.character.create({
						data: {
							name: oldMember.name,
							carryCapacity: oldMember.carryCapacity,
							sheetId: sheet.id,
							carriedItems: {
								createMany: {
									data: getCarriedItems(oldSheet.items, oldMember).map(
										(oldItem) => ({
											name: oldItem.name,
											description: oldItem.description,
											sheetId: sheet.id,
											category: oldItem.category,
											value: oldItem.value,
											weight: oldItem.weight,
											quantity: oldItem.quantity,
											referenceLink: oldItem.reference,
										})
									),
								},
							},
						},
					})
				)
			);

			// Generate Items
			await Promise.all(
				oldSheet.items
					.filter((item) => !item.carriedBy)
					.map(async (oldItem) =>
						prisma.item.create({
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
