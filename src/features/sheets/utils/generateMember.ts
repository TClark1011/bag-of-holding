import faker from "faker";
import { InventoryMemberFields } from "$sheets/types";

/**
 * A function for generating a member object given
 * the name of the member and optionally the carry
 * capacity
 *
 * @param name The name of the member to
 * generate
 * @param [carryCapacity=0] The carrying
 * capacity of the member
 * @returns The member object
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
