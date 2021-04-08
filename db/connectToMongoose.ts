import mongoose from "mongoose";
import { MONGO_URL } from "../config/env";

/**
 * Establish a connection to MongoDB via mongoose
 */
const connectToMongoose = async (): Promise<typeof mongoose> =>
	mongoose.connect(MONGO_URL, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useFindAndModify: false,
	});

export default connectToMongoose;
