import mongoose from "mongoose";
import { MONGO_URL } from "../config/env";

/**
 * Establish a connection to MongoDB via mongoose
 *
 * @returns {Promise<typeof mongoose>} Mongoose object connected to the MongoDB
 * database
 */
const connectToMongoose = (): Promise<typeof mongoose> =>
	mongoose
		.connect(MONGO_URL, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
			useFindAndModify: false,
		})
		.then((result) => {
			console.log("connected to mongoose");
			return result;
		});

export default connectToMongoose;
