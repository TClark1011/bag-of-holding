import { A, pipe } from "@mobily/ts-belt";

/**
 * Get all the unique values from an array after running
 * each element through a selector function.
 *
 * @param arr The array
 * @param selector The selector function
 */
export const getUniqueValuesOf = <Element, Selection>(
	arr: Element[],
	selector: (i: Element) => Selection
): Selection[] => pipe(arr, A.map(selector), A.uniq);

/**
 * Curried version of `getUniqueValuesOf`.
 *
 * @param selector The selector function
 */
export const _getUniqueValuesOf =
	<Element, Selection>(selector: (i: Element) => Selection) =>
	(arr: Element[]) =>
		getUniqueValuesOf(arr, selector);

/**
 * Get the difference between 2 arrays
 *
 * @param a The first array
 * @param b The second array
 */
export const arrayDiff = <Element>(a: Element[], b: Element[]) =>
	A.uniq([...A.difference(a, b), ...A.difference(b, a)]);

/**
 * Curried version of `arrayDiff`
 *
 * @param b The first array
 */
export const _arrayDiff =
	<Element>(b: Element[]) =>
	(a: Element[]) =>
		arrayDiff(a, b);
