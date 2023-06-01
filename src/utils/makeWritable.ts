import type { Writable } from "type-fest";

/**
 * Takes an object type and removes the `readonly` modifier
 *
 * @param object an object that is affected by `readonly`
 * @returns An object with the `readonly` typing modifier
 * removed
 */
const makeWritable = <T extends Record<string, any> | any[]>(object: T) =>
	object as Writable<T>;

export default makeWritable;
