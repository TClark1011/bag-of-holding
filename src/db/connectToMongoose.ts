import mongoose from "mongoose";
import { MockMongoose } from "mock-mongoose";
import { MONGO_URL } from "../config/env";
import { inTesting } from "../config/publicEnv";

/**
 *
 */
const initiateConnection = () => {
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
};

/**
 * Establish a connection to MongoDB via mongoose
 *
 * @returns {Promise<typeof mongoose>} Mongoose object connected to the MongoDB
 * database
 */
const connectToMongoose = async (): Promise<void> => {
	if (inTesting) {
		new MockMongoose(mongoose).prepareStorage().then(() => {
			initiateConnection();
		});
	} else {
		initiateConnection();
	}
};

export default connectToMongoose;
