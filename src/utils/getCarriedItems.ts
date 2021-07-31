import InventoryItemFields from "../types/InventoryItemFields";
import InventoryMemberFields from "../types/InventoryMemberFields";

/**
 * Fetch the items from a list of inventory items that are
 * carried by a passed member.
 *
 * @param items A list of inventory items
 * @param member Can take either a member
 * object, or a string. If provided a member object, then the
 * _id is pulled from the object, if provided a string, that string
 * is used as the `_id` field of the member.
 * @returns The inventory items that are carried by
 */
const getCarriedItems = (
	items: InventoryItemFields[],
	member: InventoryMemberFields | string
): InventoryItemFields[] => {
	const memberId = typeof member === "string" ? member : member._id;
	return items.filter((item) => item.carriedBy === memberId);
};

export default getCarriedItems;
