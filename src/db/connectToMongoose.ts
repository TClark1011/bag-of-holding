import mongoose from "mongoose";
import { MONGO_URL } from "../config/env";
// import { inGitHubAction } from "../config/publicEnv";

/**
 * Establish a connection to MongoDB via mongoose
 *
 * @param [url] The connection string to use. If not provided, uses
 * the MONGO_URL env variable.
 * @returns Mongoose object connected to the MongoDB
 * database
 */
const connectToMongoose = (url = MONGO_URL): Promise<typeof mongoose> =>
	mongoose
		.connect(url, {
			// useUnifiedTopology: !inGitHubAction,
			useUnifiedTopology: true,
			useNewUrlParser: true,
			useFindAndModify: false,
		})
		.then((result) => {
			console.log("connected to mongoose");
			return result;
		});

export default connectToMongoose;
