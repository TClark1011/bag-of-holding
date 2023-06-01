import { Character } from "@prisma/client";
import faker from "faker";

const generateCharacter = (name: string, carryCapacity = 0): Character => ({
	id: faker.datatype.uuid(),
	name,
	carryCapacity,
	sheetId: "",
});

export const averageMembersFixture: Character[] = [
	"Vincent",
	"Archie",
	"Sen",
	"Seath",
].map(generateCharacter);
