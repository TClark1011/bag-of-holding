import { Item } from "@prisma/client";

export const longswordFixture: Item = {
	id: "longsword id",
	name: "Longsword",
	quantity: 1,
	weight: 3,
	description: "melee weapon (martial, sword)",
	category: "Weapon",
	referenceLink: "https://roll20.net/compendium/dnd5e/Longsword#content",
	carriedByCharacterId: null,
	sheetId: "",
	value: 1,
};

export const healthPotionFixture: Item = {
	id: "health potion id",
	name: "Health Potion",
	quantity: 4,
	weight: 0.5,
	category: "Consumable",
	carriedByCharacterId: null,
	sheetId: "",
	value: 1,
	referenceLink: null,
	description: null,
};
