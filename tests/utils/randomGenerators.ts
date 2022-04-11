import {
	InventoryItemFields,
	InventoryMemberFields,
	InventorySheetFields,
} from "$sheets/types";
import faker from "faker";
import randomItem from "random-item";
import { IdentifiedObject } from "$root/types";
import { A } from "@mobily/ts-belt";

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
 * If provided, the item's `carriedBy` field is set to
 * the `_id` of a member randomly selected from this array.
 * If this is not provided and a `carriedBy` value is not
 * found in `fields`, then carriedBy is set to `Nobody`.
 * @returns Randomly Generated Inventory Item
 */
export const generateRandomInventoryItem = (
	fields: Partial<InventoryItemFields> = {},
	members?: InventoryMemberFields[]
): InventoryItemFields => ({
	_id: faker.datatype.uuid(),
	name: faker.commerce.productName().substring(0, 23),
	weight: Number(faker.datatype.number(200).toFixed(2)),
	carriedBy: members ? randomItem(members)._id : "Nobody",
	quantity: Number(faker.datatype.number(200).toFixed(0)),
	description: faker.commerce.productDescription(),
	category: faker.commerce.productAdjective(),
	// category: faker.random.alphaNumeric(5),
	reference: faker.internet.url(),
	value: Number(faker.datatype.number(200).toFixed(2)),
	...fields,
});

/**
 * Randomly generate a party member
 *
 * @param [fields={}] An object that can contain
 * any of the fields for party members. Any fields that
 * are not provided are randomly generated
 * @returns Randomly generated party member
 */
export const generateRandomPartyMember: RandomEntityGenerator<InventoryMemberFields> = (
	fields = {}
) => ({
	_id: faker.datatype.uuid(),
	name: faker.name.firstName(),
	carryCapacity: faker.datatype.number(),
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
}: Partial<RandomSheetOptions> = {}): InventorySheetFields => {
	const members = A.make(numberOfMembers, null).map(() =>
		generateRandomPartyMember({})
	);
	const items = A.make(numberOfItems, null).map(() =>
		generateRandomInventoryItem({}, members)
	);

	return {
		_id: faker.datatype.uuid(),
		items,
		members,
		name: faker.commerce.productName(),
	};
};
