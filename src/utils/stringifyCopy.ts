/**
 * Function for copying an objects value by stringifying.
 * it and then parsing the resulting string.
 * This can also be used to fix the mongoDB data that is
 * returned in the weird format.
 *
 * @template TThetype of data that should be returned
 * @param data The data to copy
 * @returns The stringified/parsed data
 */
const stringifyCopy = <T>(data: unknown): T =>
	JSON.parse(JSON.stringify(data)) as T;

export default stringifyCopy;
