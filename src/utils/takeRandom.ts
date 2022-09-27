import { A, O, pipe } from "$fp";

/**
 * Take a random element from an array
 *
 * @param arr The array to take a random
 * element from. Must not be empty.
 * @returns A random element from the array.
 */
const takeRandom = <T>(arr: T[]) => pipe(arr, A.shuffle, A.head, O.toUndefined);

export default takeRandom;
