/* eslint-disable no-case-declarations */
import {
	arrayDiff,
	mustBeNever,
	rejectItemWithId,
	toggleArrayItem,
	updateItemWithId,
} from "$root/utils";
import {
	CharacterRemovalStrategy,
	numericItemPropertySchema,
} from "$sheets/types";
import { itemIsCarriedByCharacterId } from "$sheets/utils";
import { createState, withDevtools, withReducer } from "$zustand";
import { A, D, F, pipe } from "@mobily/ts-belt";
import { Character, Item } from "@prisma/client";
import produce from "immer";
import { Reducer } from "react";
import { matchesSchema } from "$zod-helpers";
import { InventoryStoreAction } from "$sheets/store/inventoryActions";
import {
	FilterableItemProperty,
	FullSheet,
	SortableItemProperty,
} from "$sheets/types";
import {
	selectEffectivePropertyFilter,
	selectAllPossibleFilterValuesOnProperty,
} from "$sheets/store/inventorySelectors";
import { SortingDirection } from "$root/types";
import {
	createLoopedProgression,
	getLoopedProgressionValue,
	goNextOnLoopedProgression,
	LoopedProgression,
	updateLoopedProgressionToPositionOfValue,
} from "$root/utils/loopedProgression";

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
	actionIds: string[];
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
		filterDialogIsOpen: boolean;
		welcomeDialogIsOpen: boolean;
	};
};

const defaultSorting: InventoryStoreProps["ui"]["sorting"] = {
	property: "name",
	direction: "ascending",
};

const initialInventoryStoreState: InventoryStoreProps = {
	sheet: {
		characters: [],
		id: "",
		items: [],
		name: "",
		updatedAt: new Date(),
	},
	actionIds: [],
	ui: {
		characterDialog: {
			mode: "closed",
		},
		sheetNameDialogIsOpen: false,
		filters: {
			carriedByCharacterId: null,
			category: null,
		},
		sorting: defaultSorting,
		openFilterMenu: null,
		itemDialog: null,
		searchBarValue: "",
		filterDialogIsOpen: false,
		welcomeDialogIsOpen: false,
	},
};

const handleCharacterRemoval = (
	sheet: FullSheet,
	characterId: string,
	strategy: CharacterRemovalStrategy
) =>
	produce(sheet, (draftSheet) => {
		draftSheet.characters = rejectItemWithId<Character>(characterId)(
			sheet.characters
		);

		switch (strategy.type) {
			case "item-delete":
				draftSheet.items = A.reject(
					draftSheet.items,
					itemIsCarriedByCharacterId(characterId)
				);
				break;
			case "item-to-nobody":
				draftSheet.items = A.map(
					draftSheet.items,
					F.when(
						itemIsCarriedByCharacterId(characterId),
						D.set("carriedByCharacterId", null)
					)
				);
				break;
			case "item-pass":
				draftSheet.items = A.map(
					draftSheet.items,
					F.when(
						itemIsCarriedByCharacterId(characterId),
						D.set("carriedByCharacterId", strategy.data.toCharacterId)
					)
				);
				break;
			default:
				mustBeNever(strategy); // type error if switch is not exhaustive
		}
	});

const numericSortingDirectionProgression =
	createLoopedProgression<null | SortingDirection>([
		null,
		"descending",
		"ascending",
	]);

const textSortingDirectionProgression =
	createLoopedProgression<null | SortingDirection>([
		null,
		"ascending",
		"descending",
	]);

const isNumericItemProperty = matchesSchema(numericItemPropertySchema);

const inventoryStoreReducer: Reducer<
	InventoryStoreProps,
	InventoryStoreAction
> = (prevState, action) =>
	produce(prevState, (draftState) => {
		switch (action.type) {
			case "set-sheet":
				draftState.sheet = action.payload as FullSheet;
				break;
			case "set-sheet-name":
				draftState.sheet.name = action.payload;
				break;
			case "add-item":
				draftState.sheet.items.push({
					id: Math.random().toString(),
					...action.payload,
				});
				break;
			case "remove-item":
				draftState.sheet.items = rejectItemWithId<Item>(action.payload.itemId)(
					draftState.sheet.items
				);
				break;
			case "update-item":
				draftState.sheet.items = updateItemWithId<Item>(
					action.payload.itemId,
					D.merge(action.payload.data)
				)(draftState.sheet.items);
				break;
			case "remove-character":
				draftState.sheet = handleCharacterRemoval(
					draftState.sheet,
					action.payload.characterId,
					action.payload.strategy
				);
				break;
			case "add-character":
				draftState.sheet.characters.push(action.payload);
				break;
			case "update-character":
				draftState.sheet.characters = updateItemWithId<Character>(
					action.payload.characterId,
					D.merge(action.payload.data)
				)(draftState.sheet.characters);
				break;
			case "ui.open-character-edit-dialog":
				draftState.ui.characterDialog = {
					mode: "edit",
					data: {
						characterId: action.payload.characterId,
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
				draftState.ui.filters[action.payload.property] = toggleArrayItem(
					selectEffectivePropertyFilter(action.payload.property)(draftState),
					action.payload.value
				);
				break;
			case "ui.invert-filter":
				draftState.ui.filters[action.payload] = arrayDiff(
					draftState.ui.filters[action.payload] ??
						selectAllPossibleFilterValuesOnProperty(action.payload)(draftState),
					selectAllPossibleFilterValuesOnProperty(action.payload)(draftState)
				);
				break;
			case "ui.clear-filter":
				draftState.ui.filters[action.payload] = [];
				break;
			case "ui.reset-filter":
				draftState.ui.filters[action.payload] = null;
				break;
			case "ui.toggle-sort":
				const propertyTargetedForSorting = action.payload;

				const targetedPropertyIsNumeric = isNumericItemProperty(
					propertyTargetedForSorting
				);

				const sortingDirectionProgression: LoopedProgression<SortingDirection | null> =
					targetedPropertyIsNumeric
						? numericSortingDirectionProgression
						: textSortingDirectionProgression;

				const targetPropertyWasAlreadyBeingSortedBy =
					draftState.ui.sorting?.property === propertyTargetedForSorting;

				const currentSortingValueForTargetProperty: SortingDirection | null =
					targetPropertyWasAlreadyBeingSortedBy
						? draftState.ui.sorting?.direction ?? null
						: null;

				const newSortingDirection = pipe(
					sortingDirectionProgression,
					(p) =>
						updateLoopedProgressionToPositionOfValue(
							p,
							currentSortingValueForTargetProperty
						),
					goNextOnLoopedProgression,
					getLoopedProgressionValue
				);

				if (newSortingDirection === null) {
					draftState.ui.sorting = defaultSorting;
					// We never want to have no sorting, so we set it to the default
					// (ascending by name) rather than go to null
				} else {
					draftState.ui.sorting = {
						direction: newSortingDirection,
						property: action.payload,
					};
				}

				break;
			case "ui.open-filter-menu":
				draftState.ui.openFilterMenu = action.payload;
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
					characterId: action.payload,
				};
				break;
			case "ui.close-item-dialog":
				draftState.ui.itemDialog = null;
				break;
			case "ui.set-search-value":
				draftState.ui.searchBarValue = action.payload;
				break;
			case "ui.open-filter-dialog":
				draftState.ui.filterDialogIsOpen = true;
				break;
			case "ui.close-filter-dialog":
				draftState.ui.filterDialogIsOpen = false;
				break;
			case "ui.reset-all-filters":
				draftState.ui.filters = {
					carriedByCharacterId: null,
					category: null,
				};
				break;
			case "ui.open-welcome-dialog":
				draftState.ui.welcomeDialogIsOpen = true;
				break;
			case "ui.close-welcome-dialog":
				draftState.ui.welcomeDialogIsOpen = false;
				break;
			default:
				mustBeNever(action);
		}
	});

const baseInventoryStore = withReducer(
	inventoryStoreReducer,
	initialInventoryStoreState
);

const useInventoryStore = pipe(
	baseInventoryStore,
	(s) => withDevtools(s, { name: "inventory" }),
	(s) => createState(s)
);

export const useInventoryStoreDispatch = () =>
	useInventoryStore((s) => s.dispatch);

export const useInventoryStoreState = () => useInventoryStore((s) => s.sheet);

export default useInventoryStore;
