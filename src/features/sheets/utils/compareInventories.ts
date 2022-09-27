import { pipe, F, A, D } from "$fp";
import { FullSheetWithoutUpdatedAt } from "$sheets/types";

/**
 * Check if 2 different instances of inventory sheets
 * are equal. Assumes that the 2 instances are from
 * the same sheet entity. Only compares the "items",
 * "name" and "members" fields (these are the only
 * editable fields).
 *
 * @param a The first inventory sheet
 * @param b The second inventory sheet
 * @returns The result of a deep comparison of a and
 * b
 */
const compareInventories = (
	a: FullSheetWithoutUpdatedAt,
	b: FullSheetWithoutUpdatedAt
) =>
	pipe(
		[a, b],
		A.map(D.selectKeys(["items", "name", "characters"])),
		A.uniq,
		A.length,
		F.equals(1)
	);

export default compareInventories;
