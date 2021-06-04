import faker from "faker";
import InventoryMemberFields from "../types/InventoryMemberFields";

/**
 * A function for generating a member object given
 * the name of the member and optionally the carry
 * capacity
 *
 * @param {string} name The name of the member to
 * generate
 * @param {number} [carryCapacity=0] The carrying
 * capacity of the member
 * @returns {object} The member object
 */
const generateMember = (
	name: string,
	carryCapacity = 0
): InventoryMemberFields => ({
	_id: faker.datatype.uuid(),
	name,
	carryCapacity,
});

export default generateMember;
