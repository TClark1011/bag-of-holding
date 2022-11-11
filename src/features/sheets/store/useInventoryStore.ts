/* eslint-disable jsdoc/require-jsdoc */
import { ExtractResolvedPayloadActions, resolveSimpleAction } from "$actions";
import {
	arrayDiff,
	rejectItemWithId,
	toggleArrayItem,
	updateItemWithId,
} from "$root/utils";
import { CharacterRemovalStrategy, FullSheet } from "$sheets/types";
import { itemIsCarriedByCharacterId } from "$sheets/utils";
import { composeCharacter } from "$sheets/utils/sheetEntityComposers";
import { createState, withReducer } from "$zustand";
import { A, D, F } from "@mobily/ts-belt";
import { Character, Item } from "@prisma/client";
import cuid from "cuid";
import produce from "immer";
import { Reducer } from "react";
import { match } from "ts-pattern";
import { devtools } from "zustand/middleware";
import { z } from "zod";
import { matchesSchema } from "$zod-helpers";
import {
	FinalInventoryStoreAction,
	InventoryStoreAction,
	ResolvedInventoryStoreAction,
} from "$sheets/store/inventoryActions";
import { FilterableItemProperty, SortableItemProperty } from "$extra-schemas";
import {
	selectEffectivePropertyFilter,
	selectAllPossibleFilterValuesOnProperty,
} from "$sheets/store/inventorySelectors";
import { SortingDirection } from "$root/types";

export type ItemDialogStateProps =
	| {
			mode: "edit";
			characterId: string;
	  }
	| {
			mode: "new";
	  };

export type CharacterDialogStateProps =
	| {
			mode: "closed";
	  }
	| {
			mode: "edit";
			data: {
				characterId: string;
				deleteModalIsOpen: boolean;
			};
	  }
	| {
			mode: "new-character";
	  };

export type FiltersState = Record<
	FilterableItemProperty,
	(string | null)[] | null
>;

export type InventoryStoreProps = {
	sheet: FullSheet;
	resolvedActionIds: string[];
	ui: {
		characterDialog: CharacterDialogStateProps;
		sheetNameDialogIsOpen: boolean;
		filters: FiltersState;
		sorting: null | {
			property: SortableItemProperty;
			direction: SortingDirection;
		};
		openFilterMenu: null | FilterableItemProperty;
		itemDialog: ItemDialogStateProps | null;
		searchBarValue: string;
	};
};

const initialInventoryStoreState: InventoryStoreProps = {
	sheet: {
		characters: [],
		id: "",
		items: [],
		name: "",
		updatedAt: new Date(),
	},
	resolvedActionIds: [],
	ui: {
		characterDialog: {
			mode: "closed",
		},
		sheetNameDialogIsOpen: false,
		filters: {
			carriedByCharacterId: null,
			category: null,
		},
		sorting: null,
		openFilterMenu: null,
		itemDialog: null,
		searchBarValue: "",
	},
};

export const useLastInventoryStoreAction = createState(() => ({
	lastAction: null as FinalInventoryStoreAction | null,
}));

const handleCharacterRemoval = (
	sheet: FullSheet,
	characterId: string,
	strategy: CharacterRemovalStrategy
) =>
	produce(sheet, (draftSheet) => {
		draftSheet.characters = rejectItemWithId<Character>(characterId)(
			sheet.characters
		);
		match(strategy)
			.with({ type: "item-delete" }, () => {
				draftSheet.items = A.reject(
					draftSheet.items,
					itemIsCarriedByCharacterId(characterId)
				);
			})
			.with({ type: "item-to-nobody" }, () => {
				draftSheet.items = A.map(
					draftSheet.items,
					F.when(
						itemIsCarriedByCharacterId(characterId),
						D.set("carriedByCharacterId", null)
					)
				);
			})
			.with({ type: "item-pass" }, ({ data }) => {
				draftSheet.items = A.map(
					draftSheet.items,
					F.when(
						itemIsCarriedByCharacterId(characterId),
						D.set("carriedByCharacterId", data.toCharacterId)
					)
				);
			})
			.exhaustive();
	});

const resolveInventoryAction = (
	sheet: FullSheet,
	action: InventoryStoreAction,
	actionId = cuid()
): FinalInventoryStoreAction => {
	const resolvedPayload = match<
		InventoryStoreAction,
		| ExtractResolvedPayloadActions<ResolvedInventoryStoreAction>["resolvedPayload"]
		| undefined
	>(action)
		.with({ type: "add-character" }, ({ payload }) =>
			composeCharacter({ ...payload, sheetId: sheet.id })
		)
		.with({ type: "set-sheet-name" }, ({ payload }) => ({
			sheetId: sheet.id,
			newName: payload,
		}))
		.otherwise(() => undefined);
	const baseResolvedAction = resolveSimpleAction(action, actionId);
	return {
		...baseResolvedAction,
		...(resolvedPayload && { resolvedPayload }),
	} as never;
};

const inventoryStoreReducer: Reducer<
	InventoryStoreProps,
	InventoryStoreAction
> = (prevState, action) =>
	produce(prevState, (draftState) => {
		const actionId = matchesSchema(z.object({ id: z.string() }), action)
			? action.id
			: cuid();

		const resolvedAction = resolveInventoryAction(
			draftState.sheet,
			action,
			actionId
		);

		// If this action has already been applied, do not continue
		if (draftState.resolvedActionIds.includes(resolvedAction.id)) return;

		switch (resolvedAction.type) {
			case "set-sheet":
				draftState.sheet = resolvedAction.originalAction.payload as FullSheet;
				break;
			case "set-sheet-name":
				draftState.sheet.name = resolvedAction.originalAction.payload;
				break;
			case "add-item":
				draftState.sheet.items.push({
					id: Math.random().toString(),
					...resolvedAction.originalAction.payload,
				});
				break;
			case "remove-item":
				draftState.sheet.items = rejectItemWithId<Item>(
					resolvedAction.originalAction.payload.itemId
				)(draftState.sheet.items);
				break;
			case "update-item":
				draftState.sheet.items = updateItemWithId<Item>(
					resolvedAction.originalAction.payload.itemId,
					D.merge(resolvedAction.originalAction.payload.data)
				)(draftState.sheet.items);
				break;
			case "remove-character":
				draftState.sheet = handleCharacterRemoval(
					draftState.sheet,
					resolvedAction.originalAction.payload.characterId,
					resolvedAction.originalAction.payload.strategy
				);
				break;
			case "add-character":
				draftState.sheet.characters.push(resolvedAction.resolvedPayload);
				break;
			case "update-character":
				draftState.sheet.characters = updateItemWithId<Character>(
					resolvedAction.originalAction.payload.characterId,
					D.merge(resolvedAction.originalAction.payload.data)
				)(draftState.sheet.characters);
				break;
			case "ui.open-character-edit-dialog":
				draftState.ui.characterDialog = {
					mode: "edit",
					data: {
						characterId: resolvedAction.originalAction.payload.characterId,
						deleteModalIsOpen: false,
					},
				};
				break;
			case "ui.open-new-character-dialog":
				draftState.ui.characterDialog = {
					mode: "new-character",
				};
				break;
			case "ui.close-character-dialog":
				draftState.ui.characterDialog = {
					mode: "closed",
				};
				break;
			case "ui.handle-character-delete-button":
				if (draftState.ui.characterDialog.mode === "edit") {
					draftState.ui.characterDialog.data.deleteModalIsOpen = true;
				}
				break;
			case "ui.close-character-delete-confirm-dialog":
				if (draftState.ui.characterDialog.mode === "edit") {
					draftState.ui.characterDialog.data.deleteModalIsOpen = false;
				}
				break;
			case "ui.open-sheet-name-dialog":
				draftState.ui.sheetNameDialogIsOpen = true;
				break;
			case "ui.close-sheet-name-dialog":
				draftState.ui.sheetNameDialogIsOpen = false;
				break;
			case "ui.toggle-filter":
				draftState.ui.filters[
					resolvedAction.originalAction.payload.property
				] = toggleArrayItem(
					selectEffectivePropertyFilter(
						resolvedAction.originalAction.payload.property
					)(draftState),
					resolvedAction.originalAction.payload.value
				);
				break;
			case "ui.invert-filter":
				draftState.ui.filters[
					resolvedAction.originalAction.payload
				] = arrayDiff(
					draftState.ui.filters[resolvedAction.originalAction.payload] ??
						selectAllPossibleFilterValuesOnProperty(
							resolvedAction.originalAction.payload
						)(draftState),
					selectAllPossibleFilterValuesOnProperty(
						resolvedAction.originalAction.payload
					)(draftState)
				);
				break;
			case "ui.clear-filter":
				draftState.ui.filters[resolvedAction.originalAction.payload] = [];
				break;
			case "ui.reset-filter":
				draftState.ui.filters[resolvedAction.originalAction.payload] = null;
				break;
			case "ui.toggle-sort":
				if (
					draftState.ui.sorting &&
					draftState.ui.sorting.property ===
						resolvedAction.originalAction.payload
				) {
					// If the targeted property is already being sorted...
					if (draftState.ui.sorting.direction === "descending") {
						draftState.ui.sorting.direction = "ascending"; // Set it to ascending if it was descending
					} else if (draftState.ui.sorting.direction === "ascending") {
						draftState.ui.sorting = null; // If it was ascending, remove the sorting
					}
				} else {
					// If a new proeprty is being sorted by
					draftState.ui.sorting = {
						direction: "descending",
						property: resolvedAction.originalAction.payload,
					};
				}
				break;
			case "ui.open-filter-menu":
				draftState.ui.openFilterMenu = resolvedAction.originalAction.payload;
				break;
			case "ui.close-filter-menu":
				draftState.ui.openFilterMenu = null;
				break;
			case "ui.open-new-item-dialog":
				draftState.ui.itemDialog = {
					mode: "new",
				};
				break;
			case "ui.open-item-edit-dialog":
				draftState.ui.itemDialog = {
					mode: "edit",
					characterId: resolvedAction.originalAction.payload,
				};
				break;
			case "ui.close-item-dialog":
				draftState.ui.itemDialog = null;
				break;
			case "ui.set-search-value":
				draftState.ui.searchBarValue = resolvedAction.originalAction.payload;
				break;
			default:
				// @ts-expect-error `resolvedAction` will be `never` if switch is exhaustive
				resolvedAction.type; // using ts-expect-error here so this line will error if the switch is not exhaustive
		}

		draftState.resolvedActionIds.push(resolvedAction.id);
		useLastInventoryStoreAction.setState({
			lastAction: resolvedAction,
		});
	});

const useInventoryStore = createState(
	devtools(withReducer(inventoryStoreReducer, initialInventoryStoreState), {
		name: "inventory",
	})
);

// eslint-disable-next-line jsdoc/require-jsdoc
export const useInventoryStoreDispatch = () =>
	useInventoryStore((s) => s.dispatch);

// eslint-disable-next-line jsdoc/require-jsdoc
export const useInventoryStoreState = () => useInventoryStore((s) => s.sheet);

export default useInventoryStore;
