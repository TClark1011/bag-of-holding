import faker from "faker";
import InventoryItemFields from "../types/InventoryItemFields";
import { generateRandomInventoryItem } from "../utils/createInventoryItem";
import { averageMembersFixture } from "./membersFixtures";

/**
 * Generate an array of random inventory items
 *
 * @param {number} [amount]  The number of items to generate. Defaults to a
 * random value between 1 and 50.
 * @returns {InventoryItemFields[]} An array of randomly generated inventory items
 */
export const getRandomInventoryItems = (
	amount: number = faker.random.number({ min: 1, max: 50 })
): InventoryItemFields[] => {
	const result: InventoryItemFields[] = [];
	for (let i = 0; i < amount; i++) {
		result.push(generateRandomInventoryItem({}, averageMembersFixture));
	}
	return result;
};
