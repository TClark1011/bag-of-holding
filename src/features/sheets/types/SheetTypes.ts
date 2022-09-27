import { Prisma } from "@prisma/client";
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
