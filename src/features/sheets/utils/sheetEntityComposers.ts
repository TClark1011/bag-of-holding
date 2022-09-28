import { Character, Item, Prisma } from "@prisma/client";
import cuid from "cuid";
import { Except } from "type-fest";

export type ItemCreationInput = Omit<
	Prisma.ItemCreateArgs["data"],
	"sheet" | "carriedByCharacter"
> & {
	sheetId: string;
};

/**
 * Take the input used to create an item in prisma and compose
 * it into a new item
 *
 * @param creationInput The input used to create an item in prisma
 */
export const composeItem = (creationInput: ItemCreationInput): Item => ({
	carriedByCharacterId: null,
	value: null,
	weight: null,
	category: null,
	description: null,
	referenceLink: null,
	id: cuid(),
	quantity: 1,
	...creationInput,
});

export type CharacterCreationInput = Required<
	Except<Prisma.CharacterCreateInput, "id" | "sheet" | "carriedItems"> & {
		sheetId: string;
	}
>;

/**
 * Compose a new character entity
 *
 * @param input The input required to compose a new character
 */
export const composeCharacter = (input: CharacterCreationInput): Character => ({
	id: cuid(),
	...input,
});
