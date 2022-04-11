import { NonEmptyArray } from "$root/types";
import { countOccurrences } from "$root/utils";
import { A } from "@mobily/ts-belt";

/**
 * Get every set of adjacent letters in a string.
 *
 * @param setSize The size of sets to get.
 * @param string The string to get sets from. (curried)
 * @returns every set of adjacent letters in a string.
 * @example
 * getEveryAdjacentLetterSet("abcd", 2) // ["ab", "bc", "cd"]
 */
const getEveryAdjacentLetterSet = (setSize: number) => (str: string) => {
	const letterSets: string[] = [];
	for (let i = 0; i < str.length - setSize; i++) {
		const letterSet = str.substring(i, i + setSize);
		if (letterSet.length === setSize) {
			letterSets.push(letterSet);
		}
	}
	return letterSets;
};

/**
 * Return the single most common letter combo in
 * an array of strings
 *
 * @param strings An array of strings to gather the
 * most common letter combo from
 * @param setSize The size of letter sets to look for
 * @returns The single most common letter combo in
 * the array of strings.
 *
 * @example
 * getMostCommonLetterCombo(["he", "hello", "he is low"], 2) // "he"
 */
const getMostCommonLetterCombo = (
	strings: NonEmptyArray<string>,
	setSize: number
) => {
	const allLetterCombos = strings
		.map(getEveryAdjacentLetterSet(setSize))
		.flat();
	const combosSortedByFrequency = A.sortBy(allLetterCombos, (item) =>
		countOccurrences(allLetterCombos, item)
	);
	return A.head(combosSortedByFrequency);
};

export default getMostCommonLetterCombo;
