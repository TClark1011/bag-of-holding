import { basicCurry } from "$root/utils/fpHelpers";
import { A } from "@mobily/ts-belt";

function upsert<T>(
	arr: T[],
	element: T,
	equalityFn: (a: T, b: T) => boolean
): T[];
function upsert<T>(
	element: T,
	equalityFn: (a: T, b: T) => boolean
): (arr: T[]) => T[];
function upsert<T>(
	...args: [T[], T, (a: T, b: T) => boolean] | [T, (a: T, b: T) => boolean]
) {
	if (args.length === 3) {
		const [arr, element, equalityFn] = args;

		const index = arr.findIndex((item) => equalityFn(item, element));
		const elementIsNotAlreadyInArray = index === -1;

		if (elementIsNotAlreadyInArray) {
			return [...arr, element];
		}

		return A.replaceAt(arr, index, element);
	}

	const [element, equalityFn] = args;

	return (arr: T[]) => upsert(arr, element, equalityFn);
}

export default upsert;
