import { pipe, S } from "$fp";

/**
 * Compare two strings for searching purposes. Checks
 * if the subject includes the search query. Case
 * insensitive.
 *
 * @param subject The item that is being searched for
 * @param searchQuery The query being used in the
 * search
 * @returns Whether or not the subject matches the
 * search query
 */
const searchComparison = (subject: string, searchQuery: string) =>
	pipe(subject, S.toLowerCase, S.includes(searchQuery.toLowerCase()));

export default searchComparison;
