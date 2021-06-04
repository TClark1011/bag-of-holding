import { config } from "dotenv-flow";

if (!process.env.NODE_ENV) {
	config();
	//? Only configure 'dotenv-flow' if environment variables are already configured
	//? Allows env vars to be accessed by scripts without throwing an error when running the application
}

/**
 * Fetch environment variables, throwing an error if they are
 * not present
 *
 * @param {string} key The key used to access the environment
 * data.
 * @returns {string} The raw data pulled from the environment
 */
const getEnvOrThrow = (key: string): string => {
	const data = process.env[key];
	if (!data) {
		throw Error(`Required environment variable ${key} was not found`);
	}
	return data;
};

export const MONGO_URL = getEnvOrThrow("MONGO_URL");

export const UNDERGOING_MIGRATION = process.env.UNDERGOING_MIGRATION === "true";
