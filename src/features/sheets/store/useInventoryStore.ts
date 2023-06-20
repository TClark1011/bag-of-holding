import {
	arrayDiff,
	findObjectWithId,
	mustBeNever,
	rejectItemWithId,
	toggleArrayItem,
	updateItemWithId,
} from "$root/utils";
import {
	CharacterRemovalStrategy,
	numericItemPropertySchema,
} from "$sheets/types";
import {
	entityTiedDialogAtom,
	itemIsCarriedByCharacterId,
} from "$sheets/utils";
import { A, D, F, pipe } from "@mobily/ts-belt";
import { Character, Item } from "@prisma/client";
import produce from "immer";
import { matchesSchema } from "$zod-helpers";
import {
	FilterableItemProperty,
	FullSheet,
	SortableItemProperty,
} from "$sheets/types";
import {
	composeSelectEffectivePropertyFilter,
	composeSelectAllPossibleFilterValuesOnProperty,
} from "$sheets/store/inventorySelectors";
import { SortingDirection } from "$root/types";
import {
	createLoopedProgression,
	getLoopedProgressionValue,
	goNextOnLoopedProgression,
	LoopedProgression,
	updateLoopedProgressionToPositionOfValue,
} from "$root/utils/loopedProgression";
import { atomWithReducer } from "jotai/utils";
import { atom, useSetAtom } from "jotai";
import { ImmerReducer, createReducerFunction } from "$immer-reducer";

import { createSelectorHookForAtom } from "$jotai-helpers";
import { uiIsOpenAtom } from "$jotai-hash-disappear-atom";

export type FiltersState = Record<
	FilterableItemProperty,
	(string | null)[] | null
>;

export type InventoryStoreProps = {
	sheet: FullSheet;
	ui: {
		filters: FiltersState;
		sorting: null | {
			property: SortableItemProperty;
			direction: SortingDirection;
		};
		openFilterMenu: null | FilterableItemProperty;
		searchBarValue: string;
		welcomeDialogIsOpen: boolean;
	};
};

export const filterDialogIsOpenAtom = uiIsOpenAtom("filter-open");
export const sheetNameDialogIsOpenAtom = uiIsOpenAtom("sheet-name-dialog-open");

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
	ui: {
		filters: {
			carriedByCharacterId: null,
			category: null,
		},
		sorting: defaultSorting,
		openFilterMenu: null,
		searchBarValue: "",
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

class InventoryStoreReducerClass extends ImmerReducer<InventoryStoreProps> {
	/* #region Sheet Actions */
	["set-sheet"](sheet: FullSheet) {
		this.draftState.sheet = sheet;
	}

	["set-sheet-name"](name: string) {
		this.draftState.sheet.name = name;
	}
	/* #endregion */

	/* #region Item Actions */
	["add-item"](item: Item) {
		this.draftState.sheet.items.push(item);
	}

	["remove-item"]({ itemId }: { itemId: string }) {
		this.draftState.sheet.items = rejectItemWithId<Item>(itemId)(
			this.draftState.sheet.items
		);
	}

	["update-item"]({ itemId, data }: { itemId: string; data: Partial<Item> }) {
		this.draftState.sheet.items = updateItemWithId<Item>(
			itemId,
			D.merge(data)
		)(this.draftState.sheet.items);
	}
	/* #endregion */

	/* #region Character Actions */
	["add-character"](character: Character) {
		this.draftState.sheet.characters.push(character);
	}

	["remove-character"]({
		characterId,
		strategy,
	}: {
		characterId: string;
		strategy: CharacterRemovalStrategy;
	}) {
		this.draftState.sheet = handleCharacterRemoval(
			this.draftState.sheet,
			characterId,
			strategy
		);
	}

	["update-character"]({
		characterId,
		data,
	}: {
		characterId: string;
		data: Partial<Character>;
	}) {
		this.draftState.sheet.characters = updateItemWithId<Character>(
			characterId,
			D.merge(data)
		)(this.draftState.sheet.characters);
	}
	/* #endregion */

	/* #region [UI] Filter Actions */
	["ui.toggle-filter"]({
		property,
		value,
	}: {
		property: FilterableItemProperty;
		value: string | null;
	}) {
		const currentEffectivePropertyFilter = composeSelectEffectivePropertyFilter(
			property
		)(this.draftState);
		const newFilteringState = toggleArrayItem(
			currentEffectivePropertyFilter,
			value
		);

		const allPossibleFilterValuesForProperty =
			composeSelectAllPossibleFilterValuesOnProperty(property)(this.draftState);

		const newSortingStateMatchesAllPossibleValues =
			newFilteringState.length === allPossibleFilterValuesForProperty.length;

		if (newSortingStateMatchesAllPossibleValues) {
			this.draftState.ui.filters[property] = null;
		} else {
			this.draftState.ui.filters[property] = newFilteringState;
		}
	}

	["ui.invert-filter"](property: FilterableItemProperty) {
		const allPossibleFilterValuesForProperty =
			composeSelectAllPossibleFilterValuesOnProperty(property)(this.draftState);

		const currentEffectivePropertyFilter =
			this.draftState.ui.filters[property] ??
			allPossibleFilterValuesForProperty;

		const invertedFilter = arrayDiff(
			allPossibleFilterValuesForProperty,
			currentEffectivePropertyFilter
		);

		const newSortingStateMatchesAllPossibleValues =
			invertedFilter.length === allPossibleFilterValuesForProperty.length;

		if (newSortingStateMatchesAllPossibleValues) {
			this.draftState.ui.filters[property] = null;
		} else {
			this.draftState.ui.filters[property] = invertedFilter;
		}
	}

	["ui.clear-filter"](property: FilterableItemProperty) {
		// Unchecks all items
		this.draftState.ui.filters[property] = [];
	}

	["ui.reset-filter"](property: FilterableItemProperty) {
		this.draftState.ui.filters[property] = null;
	}

	["ui.reset-all-filters"]() {
		this.draftState.ui.filters = {
			carriedByCharacterId: null,
			category: null,
		};
	}
	/* #endregion */

	/* #region [UI] Filter Menu Actions */
	["ui.open-filter-menu"](property: FilterableItemProperty) {
		this.draftState.ui.openFilterMenu = property;
	}

	["ui.close-filter-menu"]() {
		this.draftState.ui.openFilterMenu = null;
	}
	/* #endregion */

	/* #region [UI] Sorting Actions */
	["ui.toggle-sort"](property: SortableItemProperty) {
		const propertyTargetedForSorting = property;

		const targetedPropertyIsNumeric = isNumericItemProperty(
			propertyTargetedForSorting
		);

		const sortingDirectionProgression: LoopedProgression<SortingDirection | null> =
			targetedPropertyIsNumeric
				? numericSortingDirectionProgression
				: textSortingDirectionProgression;

		const targetPropertyWasAlreadyBeingSortedBy =
			this.draftState.ui.sorting?.property === propertyTargetedForSorting;

		const currentSortingValueForTargetProperty: SortingDirection | null =
			targetPropertyWasAlreadyBeingSortedBy
				? this.draftState.ui.sorting?.direction ?? null
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
			this.draftState.ui.sorting = defaultSorting;
			// We never want to have no sorting, so we set it to the default
			// (ascending by name) rather than go to null
		} else {
			this.draftState.ui.sorting = {
				direction: newSortingDirection,
				property,
			};
		}
	}
	/* #endregion */

	/* #region [UI] Welcome Dialog Actions */
	["ui.open-welcome-dialog"]() {
		this.draftState.ui.welcomeDialogIsOpen = true;
	}

	["ui.close-welcome-dialog"]() {
		this.draftState.ui.welcomeDialogIsOpen = false;
	}
	/* #endregion */

	["ui.set-search-value"](query: string) {
		this.draftState.ui.searchBarValue = query;
	}
}

const inventoryStoreReducer = createReducerFunction(InventoryStoreReducerClass);

export const inventoryAtom = atomWithReducer(
	initialInventoryStoreState,
	inventoryStoreReducer
);
export const useInventoryStoreDispatch = () => useSetAtom(inventoryAtom);

export const useInventoryStore = createSelectorHookForAtom(inventoryAtom);

export const useInventoryStoreState = () =>
	useInventoryStore((s) => s.sheet, []);

export default useInventoryStore;

export const itemDialogAtom = entityTiedDialogAtom("item");

export const itemBeingEditedAtom = atom<Item | undefined>((get) => {
	const items = get(inventoryAtom).sheet.items;
	const itemBeingEditedId = get(itemDialogAtom);

	if (itemBeingEditedId === null || itemBeingEditedId === "new")
		return undefined;

	return findObjectWithId(items, itemBeingEditedId);
});

export const characterDialogAtom = entityTiedDialogAtom("character");
export const characterDeleteConfirmationDialogIsOpenAtom = atom(false);

export const characterBeingEditedAtom = atom<Character | undefined>((get) => {
	const characters = get(inventoryAtom).sheet.characters;
	const characterBeingEditedId = get(characterDialogAtom);

	if (characterBeingEditedId === null || characterBeingEditedId === "new")
		return undefined;

	return findObjectWithId(characters, characterBeingEditedId);
});
export const itemsCarriedByCharacterBeingEditedAtom = atom<Item[] | undefined>(
	(get) => {
		const characterBeingEdited = get(characterBeingEditedAtom);

		if (!characterBeingEdited) return undefined;

		const items = get(inventoryAtom).sheet.items;

		return items.filter(
			(item) => item.carriedByCharacterId === characterBeingEdited.id
		);
	}
);
