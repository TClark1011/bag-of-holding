import { hasId } from "$root/utils";
import {
	CharacterDialogStateProps,
	InventoryStoreProps,
} from "$sheets/store/useInventoryStore";
import { FullSheet } from "$sheets/types";
import { Character, Item } from "@prisma/client";
import { match } from "ts-pattern";

export type InventoryStoreSelector<Selection> = (
	state: InventoryStoreProps
) => Selection;

/**
 * Utility for defining a selector that pulls from the sheet field
 *
 * @param selector the selector
 */
export const fromSheet = <Selection>(selector: (p: FullSheet) => Selection) => (
	state: InventoryStoreProps
) => selector(state.sheet);

/* eslint-disable jsdoc/require-jsdoc */

export const selectCharacterDialogMode: InventoryStoreSelector<
	CharacterDialogStateProps["mode"]
> = (s) => s.ui.characterDialog.mode;

export const selectCharacterBeingEdited: InventoryStoreSelector<Character | null> = (
	s
) => {
	const idOfCharacterBeingEdited = match(s.ui.characterDialog)
		.with({ mode: "edit" }, ({ data }) => data.characterId)
		.otherwise(() => null);

	if (!idOfCharacterBeingEdited) return null;

	return s.sheet.characters.find(hasId(idOfCharacterBeingEdited)) ?? null;
};

export const selectCharacterCarriedItems = (
	characterId: string
): InventoryStoreSelector<Item[]> =>
	fromSheet((sheet) =>
		sheet.items.filter((item) => item.carriedByCharacterId === characterId)
	);

export const selectItemsCarriedByCharacterBeingEdited: InventoryStoreSelector<
	Item[]
> = (state) => {
	const characterBeingEdited = selectCharacterBeingEdited(state);
	const items = selectCharacterCarriedItems(characterBeingEdited?.id ?? "")(
		state
	);
	return items;
};

export const selectCharacters: InventoryStoreSelector<Character[]> = fromSheet(
	(sheet) => sheet.characters
);

export const selectSheetName: InventoryStoreSelector<string> = fromSheet(
	(s) => s.name
);

/* eslint-enable jsdoc/require-jsdoc */
