import { IdentifiedObject } from "../types/UtilityTypes";

/**
 * Use the `.find()` method on an array of objects
 * that all have '_id' fields to find the one with
 * an _id that matches the one provided
 *
 * @param {object} entities The array of objects
 * in which to search for the matching object
 * @param {string} _id The '_id' to search for
 * @returns {string | undefined} The result
 * of using the `.find()` method to find the
 * matching object
 */
const findItemWithId = <T extends IdentifiedObject>(
	entities: T[],
	_id: string
): T | undefined => entities.find((item) => item._id === _id);

export default findItemWithId;
