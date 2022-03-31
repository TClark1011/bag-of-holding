import { BROWSER } from "$root/config";
import { pipe } from "$fp";
import { makeWritable } from "$root/utils";

/**
 * Get the url slug as a string array
 *
 * @returns an array containing the slug sections
 * of the current pathname if not on the browser,
 * return an empty array
 */
const getUrlSlug = (): string[] =>
	pipe(BROWSER ? window.location.pathname.split("/") : [], makeWritable);

export default getUrlSlug;
