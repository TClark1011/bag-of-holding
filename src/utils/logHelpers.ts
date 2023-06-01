import { inDevelopment } from "$root/config";

/**
 * Run `console.debug` if in development mode.
 *
 * @param params The parameters to log
 */
export const debugLog = (...params: any[]) => {
	if (inDevelopment) {
		console.debug(...params);
	}
};

/**
 * A curried function to call `debugLog` with a prefix
 *
 * @param prefix The prefix to add to the log
 */
export const debugLogWithPrefix =
	(prefix: string) =>
	(...params: any[]) =>
		debugLog(prefix, ...params);
