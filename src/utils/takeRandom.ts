import { NonEmptyArray } from "$root/types";
import { A, pipe } from "$fp";

/**
 * Take a random element from an array
 *
 * @param arr The array to take a random
 * element from. Must not be empty.
 * @returns A random element from the array.
 */
const takeRandom = <T>(arr: NonEmptyArray<T>) =>
	pipe(arr, A.shuffle, A.getUnsafe(0));

export default takeRandom;
