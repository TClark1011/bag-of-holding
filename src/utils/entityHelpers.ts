import { Updater } from "$root/types";
import { A, F } from "@mobily/ts-belt";

/**
 * Curried function for checking if an object has
 * a specific id
 *
 * @param id The id to check for
 */
export const hasId = <Entity extends { id: string }>(id: string) => (
	entity: Entity
) => entity.id === id;

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
export const updateItemWithId = <Entity extends { id: string }>(
	targetId: string,
	updater: Updater<Entity>
) => (entities: Entity[]): Entity[] =>
		entities.map(F.when(hasId(targetId), updater));

/**
 * Remove the item(s) from an array that has a specified id
 *
 * @param targetId The id to target
 */
export const rejectItemWithId = <Entity extends { id: string }>(
	targetId: string
) => (entities: Entity[]): Entity[] => A.reject(entities, hasId(targetId));
