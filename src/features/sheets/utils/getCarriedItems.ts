import { Character, Item } from "@prisma/client";

/**
 * Fetch the items from a list of inventory items that are
 * carried by a passed member.
 *
 * @param items A list of inventory items
 * @param member Can take either a member
 * object, or a string. If provided a member object, then the
 * id is pulled from the object, if provided a string, that string
 * is used as the `id` field of the member.
 * @returns The inventory items that are carried by
 */
const getCarriedItems = (items: Item[], member: Character | string): Item[] => {
	const memberId = typeof member === "string" ? member : member.id;
	return items.filter((item) => item.carriedByCharacterId === memberId);
};

export default getCarriedItems;
