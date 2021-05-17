import InventoryItemFields from "../types/InventoryItemFields";
import InventoryMemberFields from "../types/InventoryMemberFields";

/**
 * Check whether or not a party member is carrying a
 * specific item
 *
 * @param {object} member A party member
 * @param {object} item An inventory item
 * @returns {boolean} Whether or not the passed party
 * member is carrying the passed item.
 */
export const memberIsCarrying = (
	member: InventoryMemberFields,
	item: InventoryItemFields
): boolean => item.carriedBy === member._id;
