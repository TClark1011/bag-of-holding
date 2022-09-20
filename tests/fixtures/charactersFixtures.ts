import { generateCharacter } from "$sheets/utils";
import { Character } from "@prisma/client";

export const averageMembersFixture: Character[] = [
	"Vincent",
	"Archie",
	"Sen",
	"Seath",
].map(generateCharacter);
