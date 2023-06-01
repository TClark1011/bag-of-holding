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

export type GetEntityByProperty<EntityName extends FullSheetEntityProperty> =
	FullSheet[EntityName][number];

export const sortableItemPropertySchema = itemSchema
	.pick({
		category: true,
		carriedByCharacterId: true,
		name: true,
		weight: true,
		value: true,
		quantity: true,
	})
	.keyof();
export type SortableItemProperty = z.infer<typeof sortableItemPropertySchema>;

export const numericItemPropertySchema = itemSchema
	.pick({ quantity: true, weight: true, value: true })
	.keyof();
export type NumericItemProperty = z.infer<typeof numericItemPropertySchema>;
