import { IdentifiedObject } from "$root/types";

/**
 * Take an array of objects that have 'id' fields and
 * return just the ids. Used in reducers when removing
 * items from lists.
 *
 * @param entities The entities to fetch the
 * ids from.
 * @returns An array containing the ids of
 * the entities
 */
const getIds = <T extends IdentifiedObject>(entities: T[]): string[] =>
	entities.map((item) => item.id);

export default getIds;
