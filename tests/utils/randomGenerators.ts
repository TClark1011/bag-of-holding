import faker from "faker";
import randomItem from "random-item";
import { IdentifiedObject } from "$root/types";
import { A } from "@mobily/ts-belt";
import { Character, Item, Sheet } from "@prisma/client";
import { FullSheet } from "$sheets/types";

/**
 * A Function type for functions that return randomly
 * generated data entities.
 */
export type RandomEntityGenerator<Entity extends IdentifiedObject> = (
	fields: Partial<Entity>
) => Entity;

/**
 * Randomly generate an inventory item
 *
 * @param [fields={}] An object that can contain
 * any of the fields for inventory items. Any fields that
 * are not provided are randomly generated
 * @param [members] Array of inventory members.
 * If provided, the item's `carriedByCharacterId` field is set to
 * the `id` of a member randomly selected from this array.
 * If this is not provided and a `carriedByCharacterId` value is not
 * found in `fields`, then carriedByCharacterId is set to `Nobody`.
 * @returns Randomly Generated Inventory Item
 */
export const generateRandomInventoryItem = (
	fields: Partial<Item> = {},
	members?: Character[]
): Item => {
	return {
		id: faker.datatype.uuid(),
		name: faker.commerce.productName().substring(0, 23),
		weight: Number(faker.datatype.number(200).toFixed(2)),
		carriedByCharacterId: members ? randomItem(members).id : "Nobody",
		quantity: Number(faker.datatype.number(200).toFixed(0)),
		description: faker.commerce.productDescription(),
		category: faker.commerce.productAdjective(),
		referenceLink: faker.internet.url(),
		value: Number(faker.datatype.number(200).toFixed(2)),
		sheetId: "",
		...fields,
	};
};

/**
 * Randomly generate a party member
 *
 * @param [fields={}] An object that can contain
 * any of the fields for party members. Any fields that
 * are not provided are randomly generated
 * @returns Randomly generated party member
 */
export const generateRandomPartyMember: RandomEntityGenerator<Character> = (
	fields = {}
) => ({
	id: faker.datatype.uuid(),
	name: faker.name.firstName(),
	carryCapacity: faker.datatype.number(),
	sheetId: "",
	...fields,
});

export type RandomSheetOptions = {
	numberOfMembers: number;
	numberOfItems: number;
};

/**
 * Generate a inventory sheet with random members and
 * items
 *
 * @param options The options for how to run
 * @param [options.numberOfMembers=4] The number of members
 * to generate for the sheet
 * @param [options.numberOfItems=50] The number of items to
 * generate
 * @returns A randomly generated inventory sheet
 */
export const generateRandomInventorySheet = ({
	numberOfMembers = 4,
	numberOfItems = 50,
}: Partial<RandomSheetOptions> = {}): FullSheet => {
	const characters = A.make(numberOfMembers, null).map(() =>
		generateRandomPartyMember({})
	);
	const items = A.make(numberOfItems, null).map(() =>
		generateRandomInventoryItem({}, characters)
	);

	return {
		id: faker.datatype.uuid(),
		items,
		characters,
		name: faker.commerce.productName(),
		updatedAt: new Date(),
	};
};
