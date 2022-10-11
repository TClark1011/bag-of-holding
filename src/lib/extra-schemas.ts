import { characterSchema } from "prisma/schemas/character";
import { itemSchema } from "prisma/schemas/item";
import { sheetSchema } from "prisma/schemas/sheet";

export const itemCreationSchema = itemSchema.pick({
	name: true,
	quantity: true,
	weight: true,
	carriedByCharacterId: true,
	category: true,
	description: true,
	referenceLink: true,
	value: true,
});

export const fullSheetSchema = sheetSchema.extend({
	items: itemSchema.array(),
	characters: characterSchema.array(),
});
