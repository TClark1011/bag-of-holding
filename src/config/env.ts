export const BROWSER = typeof window !== "undefined";
export const SERVER = !BROWSER;

/**
 * Fetch environment variables, throwing an error if they are
 * not present
 *
 * @param key The key used to access the environment
 * data.
 * @param [requiredInFrontend=true] If the env is required in
 * frontend as well as backend. If this is false, an error will
 * only be thrown if the env variable is falsy on the server.
 * @returns The raw data pulled from the environment
 */
const getEnvOrThrow = (key: string, requiredInFrontend = true): string => {
	const data = process.env[key];
	if (data === undefined && (SERVER || requiredInFrontend)) {
		// We only throw an error if either
		// - We are in the backend
		// - We are in the frontend and the env is required in the frontend
		throw Error(`Required environment variable '${key}' was not found`);
	}
	return data as string;
};

export const UNDERGOING_MIGRATION = process.env.UNDERGOING_MIGRATION === "true";

export const MONTHS_INACTIVE_OLD_SHEET = Number(
	getEnvOrThrow("MONTHS_INACTIVE_OLD_SHEET_DELETE", false)
);

export const PUSHER_SECRET = getEnvOrThrow("PUSHER_SECRET", false);
export const PUSHER_APP_ID = getEnvOrThrow("PUSHER_APP_ID", false);
export const NEXT_PUBLIC_PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY ?? "";
export const NEXT_PUBLIC_PUSHER_CLUSTER =
	process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "";
