import { Prisma } from "@prisma/client";
import { characterSchema } from "prisma/schemas/character";
import { itemSchema } from "prisma/schemas/item";
import { sheetSchema } from "prisma/schemas/sheet";
import { z } from "zod";
//? name max length (max length: 24 chars)

//? Information about sheet used for the 'recent sheets' feature

const createSheetValidator = Prisma.validator<Prisma.SheetArgs>();

const sheetWithItemsValidator = createSheetValidator({
	include: {
		items: true,
	},
});

const sheetWithCharactersValidator = createSheetValidator({
	include: {
		characters: true,
	},
});

export type OmitMetadataSheetProps<Sheet> = Omit<Sheet, "id" | "updatedAt">;

export type SheetWithItems = Prisma.SheetGetPayload<
	typeof sheetWithItemsValidator
>;

export type SheetWithCharacters = Prisma.SheetGetPayload<
	typeof sheetWithCharactersValidator
>;

export type FullSheet = SheetWithItems & SheetWithCharacters;

export interface SheetMenuItemFields
	extends Omit<SheetWithCharacters, "updatedAt"> {
	lastAccessedAt: Date;
}

export type FullSheetWithoutUpdatedAt = Omit<FullSheet, "updatedAt">;

export type FilterableItemProperty = z.infer<
	typeof filterableItemPropertySchema
>;

export type GetEntityByProperty<EntityName extends FullSheetEntityProperty> =
	FullSheet[EntityName][number];

export type ItemFromSchema = z.infer<typeof itemSchema>;

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

export const fullSheetSchema = sheetSchema.extend({
	items: itemSchema.array(),
	characters: characterSchema.array(),
});

export const fullSheetEntityPropertySchema = fullSheetSchema
	.pick({ items: true, characters: true })
	.keyof();

export type FullSheetEntityProperty = z.infer<
	typeof fullSheetEntityPropertySchema
>;

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
