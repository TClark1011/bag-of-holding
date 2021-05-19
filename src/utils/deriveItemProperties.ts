import Big from "big.js";
import InventoryItemFields from "../types/InventoryItemFields";

/**
 * Calculate the total weight of all the instances of an item
 * (weight * quantity)
 *
 * @param {object} item The item to calculate the weight of
 * @returns {number} The calculated weight
 */
export const getItemTotalWeight = (item: InventoryItemFields): number =>
	new Big(item.weight || 0).mul(new Big(item.quantity)).toNumber();

/**
 * Calculate the total value of all the instances of an item
 * (value * quantity)
 *
 * @param {object} item The item to calculate the value of
 * @returns {number} The calculated value
 */
export const getItemTotalValue = (item: InventoryItemFields): number =>
	new Big(item.value || 0).mul(new Big(item.quantity)).toNumber();
