import { inProduction } from "../src/config/publicEnv";
import connectToMongoose from "../src/db/connectToMongoose";
import SheetModel, { ProductionSheetModel } from "../src/db/SheetModel";

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
				console.log(
					"An error ocurred while attempting to copy production data into the development database"
				);
				console.log(err);
			});
	}

	return;
})();
