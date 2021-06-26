import SheetModel, { ProductionSheetModel } from "../src/db/SheetModel";
import connectToMongoose from "../src/db/connectToMongoose";
import faker from "faker";
import confirmationPrompt from "yesno";

(async () => {
	await connectToMongoose();

	const MigratingModel = (await confirmationPrompt({
		question: "Do you wish to migrate production data or development data?",
		yesValues: ["production", "prod"],
		noValues: ["development", "dev"],
	}))
		? ProductionSheetModel
		: SheetModel;
	if (MigratingModel.modelName !== "dev-sheet") {
		if (
			(await confirmationPrompt({
				question: "Migration will mutate production data. Continue?",
			})) &&
			(await confirmationPrompt({
				question:
					"Have you exported a backup of production data into a JSON file?",
			}))
		) {
			console.log("Migration on production data will continue");
		} else {
			console.log("Cancelling data migration");
			return;
		}
	} else {
		console.log("Migration is being performed on development database");
	}
	const data = await MigratingModel.find({});

	await data.forEach(async (sheet) => {
		sheet.members = sheet.members.map((memberName) => ({
			_id: faker.datatype.uuid(),
			carryWeight: 0,
			name: memberName,
		}));
		sheet.items = sheet.items.map((item) => ({
			...item,
			carriedBy:
				sheet.members.find(({ name }) => name === item.carriedBy)?._id ||
				"Nobody",
		}));
		await sheet.save();
	});

	console.log("Data migration complete");

	return;
})();
