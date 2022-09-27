import { Character } from "@prisma/client";
import faker from "faker";

/**
 * A function for generating a character object given
 * the name of the character and optionally the carry
 * capacity
 *
 * @param name The name of the character to
 * generate
 * @param [carryCapacity=0] The carrying
 * capacity of the character
 * @returns The character object
 */
const generateCharacter = (name: string, carryCapacity = 0): Character => ({
	id: faker.datatype.uuid(),
	name,
	carryCapacity,
	sheetId: "",
});

export default generateCharacter;
