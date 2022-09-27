import { Character, Item } from "@prisma/client";

/**
 * Check whether or not a party member is carrying a
 * specific item
 *
 * @param member A party member
 * @param item An inventory item
 * @returns Whether or not the passed party
 * member is carrying the passed item.
 */
export const characterIsCarrying = (member: Character, item: Item): boolean =>
	item.carriedByCharacterId === member.id;
