import { Character, Item } from "@prisma/client";
import Big from "big.js";

type ItemDerivation<Return, ExtraParams extends any[] = []> = (
	item: Item,
	...args: ExtraParams
) => Return;

/**
 * Calculate the total weight of all the instances of an item
 * (weight * quantity)
 *
 * @param item The item to calculate the weight of
 * @returns The calculated weight
 */
export const getItemTotalWeight: ItemDerivation<number> = (item) =>
	new Big(item.weight || 0).mul(new Big(item.quantity)).toNumber();

/**
 * Calculate the total value of all the instances of an item
 * (value * quantity)
 *
 * @param item The item to calculate the value of
 * @returns The calculated value
 */
export const getItemTotalValue: ItemDerivation<number> = (item) =>
	new Big(item.value || 0).mul(new Big(item.quantity)).toNumber();

/**
 * Given an item and the members in the sheet, return
 * the object representing the party member who is
 * carrying the passed item.
 *
 * @param item The item which you want to get the carrier
 * of
 * @param item.carriedByCharacterId the id of the party
 * character that is carrying the item
 * @param characters The party members in the sheets
 * @returns The data of the party member who is carrying
 * the passed item
 */
export const getCarrier: ItemDerivation<
	Character | undefined,
	[Character[]]
> = ({ carriedByCharacterId }, characters) =>
	carriedByCharacterId !== undefined
		? characters.find(({ id }) => id === carriedByCharacterId)
		: undefined;
