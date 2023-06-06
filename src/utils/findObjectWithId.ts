import { IdentifiedObject } from "$root/types";

function findObjectWithId<T extends IdentifiedObject>(
	arr: T[],
	id: T["id"]
): T | undefined;
function findObjectWithId<T extends IdentifiedObject>(
	id: T["id"]
): (arr: T[]) => T | undefined;
function findObjectWithId<T extends IdentifiedObject>(
	...args: [T[], T["id"]] | [T["id"]]
) {
	if (args.length === 2) {
		const [arr, id] = args;

		return arr.find((obj) => obj.id === id);
	}

	const [id] = args;

	return (arr: T[]) => findObjectWithId(arr, id);
}

export default findObjectWithId;
