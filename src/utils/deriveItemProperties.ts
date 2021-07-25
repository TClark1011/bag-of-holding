import Big from "big.js";
import InventoryItemFields from "../types/InventoryItemFields";
import InventoryMemberFields from "../types/InventoryMemberFields";

type ItemDerivation<Return, ExtraParams extends any[] = []> = (
	item: InventoryItemFields,
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
 * @param {object} item The item to calculate the value of
 * @returns {number} The calculated value
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
 * @param members The party members in the sheets
 * @returns The data of the party member who is carrying
 * the passed item
 */
export const getCarrier: ItemDerivation<
	InventoryMemberFields | undefined,
	[InventoryMemberFields[]]
> = ({ carriedBy }, members) =>
	carriedBy !== undefined
		? members.find(({ _id }) => _id === carriedBy)
		: undefined;
