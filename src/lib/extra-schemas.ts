import { characterSchema } from "prisma/schemas/character";
import { itemSchema } from "prisma/schemas/item";
import { sheetSchema } from "prisma/schemas/sheet";
import { z } from "zod";

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

export const filterableItemPropertySchema = itemSchema
	.pick({
		carriedByCharacterId: true,
		category: true,
	})
	.keyof();

export type FilterableItemProperty = z.infer<
	typeof filterableItemPropertySchema
>;

export const fullSheetSchema = sheetSchema.extend({
	items: itemSchema.array(),
	characters: characterSchema.array(),
});

export type FullSheet = z.infer<typeof fullSheetSchema>;

export const fullSheetEntityPropertySchema = fullSheetSchema
	.pick({ items: true, characters: true })
	.keyof();

export type FullSheetEntityProperty = z.infer<
	typeof fullSheetEntityPropertySchema
>;

export type GetEntityByProperty<
	EntityName extends FullSheetEntityProperty
> = FullSheet[EntityName][number];