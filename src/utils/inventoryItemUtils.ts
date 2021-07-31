import InventoryItemFields from "../types/InventoryItemFields";
import InventoryMemberFields from "../types/InventoryMemberFields";

/**
 * Check whether or not a party member is carrying a
 * specific item
 *
 * @param member A party member
 * @param item An inventory item
 * @returns Whether or not the passed party
 * member is carrying the passed item.
 */
export const memberIsCarrying = (
	member: InventoryMemberFields,
	item: InventoryItemFields
): boolean => item.carriedBy === member._id;
