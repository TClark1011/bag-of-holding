import { Action, PayloadAction } from "$actions";
import {
	FilterableItemProperty,
	FullSheet,
	SortableItemProperty,
} from "$sheets/types";
import { CharacterRemovalStrategy, ItemCreationFields } from "$sheets/types";
import { Character, Item } from "@prisma/client";

type CharacterCreationAction = PayloadAction<"add-character", Character>;

type SetSheetNameAction = PayloadAction<"set-sheet-name", string>;

export type InventoryStoreAction =
	// Sheet Actions...
	| PayloadAction<"set-sheet", FullSheet>
	| SetSheetNameAction
	| PayloadAction<"add-item", Omit<Item, "id">>
	| PayloadAction<"remove-item", { itemId: string }>
	| PayloadAction<
			"update-item",
			{ itemId: string; data: Partial<ItemCreationFields> }
	  >
	| CharacterCreationAction
	| PayloadAction<
			"remove-character",
			{ characterId: string; strategy: CharacterRemovalStrategy }
	  >
	| PayloadAction<
			"update-character",
			{
				characterId: string;
				data: Partial<Pick<Character, "name" | "carryCapacity">>;
			}
	  >
	// UI Actions...
	| PayloadAction<"ui.set-search-value", string>
	| Action<"ui.open-filter-dialog">
	| Action<"ui.close-filter-dialog">
	| Action<"ui.reset-all-filters">
	| Action<"ui.open-welcome-dialog">
	| Action<"ui.close-welcome-dialog">
	| Action<"ui.open-new-item-dialog">
	| PayloadAction<"ui.open-item-edit-dialog", string>
	| Action<"ui.close-item-dialog">
	| PayloadAction<"ui.open-filter-menu", FilterableItemProperty>
	| Action<"ui.close-filter-menu">
	| PayloadAction<"ui.toggle-sort", SortableItemProperty>
	| PayloadAction<"ui.reset-filter", FilterableItemProperty>
	| PayloadAction<"ui.clear-filter", FilterableItemProperty>
	| PayloadAction<"ui.invert-filter", FilterableItemProperty>
	| PayloadAction<
			"ui.toggle-filter",
			{
				property: FilterableItemProperty;
				value: string | null;
			}
	  >
	| Action<"ui.open-sheet-name-dialog">
	| Action<"ui.close-sheet-name-dialog">
	| Action<"ui.open-new-character-dialog">
	| Action<"ui.close-character-dialog">
	| PayloadAction<"ui.open-character-edit-dialog", { characterId: string }>
	| Action<"ui.close-character-delete-confirm-dialog">
	| Action<"ui.handle-character-delete-button">;
