import { inProduction } from "../src/config/publicEnv";
import connectToMongoose from "../src/features/backend/utils/connectToMongoose";
import mongoose from "mongoose";
import { ProductionSheetModel, SheetModel } from "$backend/models";

// Copy over data from production database into
// development database that is used when running
// on localhost
(async () => {
	if (!inProduction) {
		await connectToMongoose();
		const prodData = await ProductionSheetModel.find({});
		await SheetModel.deleteMany({});
		await SheetModel.insertMany(prodData, { lean: true })
			.then(() => {
				console.log(
					"production data has been copied into the development database"
				);
			})
			.catch((err) => {
				console.error(
					"An error ocurred while attempting to copy production data into the development database"
				);
				console.error(err);
			})
			.finally(() => {
				mongoose.connection.close();
			});
	}

	return;
})();
