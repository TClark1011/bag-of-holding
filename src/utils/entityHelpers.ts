import { IdentifiedObject, Updater } from "$root/types";
import { A, F } from "@mobily/ts-belt";

/**
 * Curried function for checking if an object has
 * a specific id
 *
 * @param id The id to check for
 */
export const hasId =
	<Entity extends IdentifiedObject>(id: Entity["id"]) =>
	(entity: Entity) =>
		entity.id === id;

/**
 * A function for mapping over an array of entities and applying
 * an update to an item that has a specific id
 *
 * @param targetId The id to look for
 * @param updater A function that takes the item to update and
 * returns the updated item
 * @returns The array with the specified item updated. If the specified
 * item does not exist in the array, then the original array is returned
 * unchanged
 */
export const updateItemWithId =
	<Entity extends IdentifiedObject>(
		targetId: Entity["id"],
		updater: Updater<Entity>
	) =>
	(entities: Entity[]): Entity[] =>
		entities.map(F.when(hasId(targetId), updater));

export function rejectItemWithId<T extends IdentifiedObject>(
	arr: T[],
	id: T["id"]
): T[];
export function rejectItemWithId<T extends IdentifiedObject>(
	id: T["id"]
): (arr: T[]) => T[];
export function rejectItemWithId<T extends IdentifiedObject>(
	...args: [T[], T["id"]] | [T["id"]]
) {
	if (args.length === 2) {
		const [arr, id] = args;
		return A.reject(arr, hasId(id));
	}

	const [id] = args;
	return (arr: T[]) => rejectItemWithId(arr, id);
}

export function matchById<T extends IdentifiedObject>(a: T, b: T): boolean;
export function matchById<T extends IdentifiedObject>(a: T): (b: T) => boolean;
export function matchById<T extends IdentifiedObject>(...args: [T, T] | [T]) {
	if (args.length === 2) {
		const [a, b] = args;
		return a.id === b.id;
	}

	const [a] = args;
	return (b: T) => matchById(a, b);
}
