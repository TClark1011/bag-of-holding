import { MongoMemoryServer } from "mongodb-memory-server";

/**
 * Initialize a MongoDB database for testing. Runs
 * on port 3002.
 */
const initMockDB = () =>
	MongoMemoryServer.create({
		instance: {
			port: 3002,
		},
	});

export default initMockDB;
