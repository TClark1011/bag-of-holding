import { inProduction } from "../src/config/publicEnv";
import connectToMongoose from "../src/features/backend/utils/connectToMongoose";
import mongoose from "mongoose";
import { ProductionSheetModel, SheetModel } from "$backend/models";
import ora from "ora";

// Copy over data from production database into
// development database that is used when running
// on localhost
(async () => {
	if (!inProduction) {
		await connectToMongoose();

		const fetchSpinner = ora("Fetching Production Sheets").start();
		const prodData = await ProductionSheetModel.find({});

		fetchSpinner.succeed(`Found ${prodData.length} sheets`);

		const deleteSpinner = ora("Deleting Development Sheets").start();
		const deleteResult = await SheetModel.deleteMany({});
		deleteSpinner.succeed(`Deleted ${deleteResult.deletedCount} sheets`);

		const createSpinner = ora("Creating Development Sheets").start();
		await SheetModel.insertMany(prodData, { lean: true })
			.then(() => {
				createSpinner.succeed(
					"Copied over all production sheets to dev database"
				);
			})
			.catch((err) => {
				createSpinner.fail("Error");
				console.error(err);
			})
			.finally(() => {
				mongoose.connection.close();
			});
	}

	return;
})().finally(() => {
	process.exit();
});
