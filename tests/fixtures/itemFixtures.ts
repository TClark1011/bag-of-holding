import faker from "faker";
import InventoryItemFields from "../../src/types/InventoryItemFields";
import { generateRandomInventoryItem } from "../../src/utils/createInventoryItem";
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

export const longswordFixture: InventoryItemFields = {
	_id: "longsword _id",
	name: "Longsword",
	quantity: 1,
	weight: 3,
	description: "melee weapon (martial, sword)",
	category: "Weapon",
	reference: "https://roll20.net/compendium/dnd5e/Longsword#content",
};

export const healthPotionFixture: InventoryItemFields = {
	_id: "health potion _id",
	name: "Health Potion",
	quantity: 4,
	weight: 0.5,
	category: "Consumable",
};
