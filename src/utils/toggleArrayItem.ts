import { A, F } from "@mobily/ts-belt";

/**
 * Toggle an item in an array
 *
 * @param arr The array to toggle the item in
 * @param item The item to toggle
 * @returns A new array with the item removed if
 * it was originally present, or appended if it
 * was not
 */
const toggleArrayItem = <T>(arr: T[], item: T) =>
	F.ifElse(arr, A.includes(item), A.reject(F.equals(item)), A.append(item));

export default toggleArrayItem;
