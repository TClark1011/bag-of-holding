import mongoose from "mongoose";
import { MONGO_URL } from "../config/env";

/**
 * Establish a connection to MongoDB via mongoose
 */
const connectToMongoose = (): void => {
	mongoose
		.connect(MONGO_URL, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
			useFindAndModify: false,
		})
		.then(() => console.log("connected to mongoose"));
};

export default connectToMongoose;
