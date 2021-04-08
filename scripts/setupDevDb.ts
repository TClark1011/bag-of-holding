import mongoose from "mongoose";
import connectToMongoose from "../db/connectToMongoose";
import { getSheetModelName } from "../db/SheetModel";

console.log("(setupDevDb) process.env.NODE_ENV: ", process.env.NODE_ENV);

/**
 *
 */
// const setupDevDb = async () => {
// 	await connectToMongoose();
// 	const allSheets = mongoose.models[getSheetModelName(true)].find({});
// 	mongoose.models[getSheetModelName()].insertMany(allSheets);
// };

// setupDevDb();
