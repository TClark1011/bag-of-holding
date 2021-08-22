import InventoryItemFields from "../../src/types/InventoryItemFields";
import { generateRandomInventoryItem } from "./randomGenerators";

/**
 * Get an array of randomly generated inventory items
 *
 * @param length How many items to generate
 * @param params Object that gets passed to
 * `generateRandomInventoryItem` to generate each item
 * @returns An array of randomly generated inventory
 * items
 */
export const getArrayOfRandomItems = (
	length: number,
	params: Parameters<typeof generateRandomInventoryItem>[0] = {}
): InventoryItemFields[] =>
	[...Array(length)].map(() => generateRandomInventoryItem(params));
