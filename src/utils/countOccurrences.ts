import { A, F, pipe } from "@mobily/ts-belt";

/**
 * Count how many times an item appears in an
 * array
 *
 * @param arr The array within which to count
 * the occurrences of the item
 * @param value The item of which to count the
 * occurrences
 * @returns The number of times the item appears
 * in the array
 */
const countOccurrences = <T>(arr: T[], value: T): number =>
	pipe(arr, A.filter(F.equals(value)), A.length);

export default countOccurrences;
