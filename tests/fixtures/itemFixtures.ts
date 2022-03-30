import { InventoryItemFields } from "$sheets/types";

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
