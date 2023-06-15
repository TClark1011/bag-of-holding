import {
	FilterableItemProperty,
	FullSheetEntityProperty,
	GetEntityByProperty,
	NumericItemProperty,
	SortableItemProperty,
	FullSheet,
	FILTERABLE_ITEM_PROPERTIES,
} from "$sheets/types";
import {
	coerceDudStringToNull,
	findObjectWithId,
	getUniqueValuesOf,
	hasId,
} from "$root/utils";
import {
	CharacterDialogStateProps,
	InventoryStoreProps,
} from "$sheets/store/useInventoryStore";
import {
	getItemTotalValue,
	getItemTotalWeight,
	searchComparison,
} from "$sheets/utils";
import { A, D, F, G, O, flow, pipe } from "@mobily/ts-belt";
import { Character, Item } from "@prisma/client";
import Big from "big.js";
import { match } from "ts-pattern";
import { get } from "$fp";
import { Fn, PropertyGetters } from "$root/types";

/**
 * Gets the "category" field of an item and coerces
 * an empty string value to null
 */
const safelySelectitemCategory: Fn<[Item], string | null> = flow(
	get("category"),
	O.fromNullable,
	O.mapNullable(coerceDudStringToNull),
	O.toNullable
);

const itemPropertyGetters: PropertyGetters<Item> = {
	id: get("id"),
	name: get("name"),
	weight: get("weight"),
	value: get("value"),
	category: safelySelectitemCategory,
	quantity: get("quantity"),
	carriedByCharacterId: get("carriedByCharacterId"),
	description: get("description"),
	referenceLink: get("referenceLink"),
	sheetId: get("sheetId"),
};

export type InventoryStoreSelector<Selection> = (
	state: InventoryStoreProps
) => Selection;

/**
 * Utility for defining a selector that pulls from the sheet field
 *
 * @param selector the selector
 */
export const fromSheet =
	<Selection>(selector: (p: FullSheet) => Selection) =>
	(state: InventoryStoreProps) =>
		selector(state.sheet);

export const fromUI =
	<Selection>(
		selector: (p: InventoryStoreProps["ui"]) => Selection
	): InventoryStoreSelector<Selection> =>
	(state) =>
		selector(state.ui);

export const selectCharacterDialogMode: InventoryStoreSelector<
	CharacterDialogStateProps["mode"]
> = (s) => s.ui.characterDialog.mode;

export const selectCharacterBeingEdited: InventoryStoreSelector<
	Character | null
> = (s) => {
	const idOfCharacterBeingEdited = match(s.ui.characterDialog)
		.with({ mode: "edit" }, ({ data }) => data.characterId)
		.otherwise(() => null);

	if (!idOfCharacterBeingEdited) return null;

	return s.sheet.characters.find(hasId(idOfCharacterBeingEdited)) ?? null;
};

export const composeSelectCharacterWithIdCarriedItems = (
	characterId: string
): InventoryStoreSelector<Item[]> =>
	fromSheet((sheet) =>
		sheet.items.filter((item) => item.carriedByCharacterId === characterId)
	);

export const selectItemsCarriedByCharacterBeingEdited: InventoryStoreSelector<
	Item[]
> = (state) => {
	const characterBeingEdited = selectCharacterBeingEdited(state);
	const items = composeSelectCharacterWithIdCarriedItems(
		characterBeingEdited?.id ?? ""
	)(state);
	return items;
};

export const selectCharacters: InventoryStoreSelector<Character[]> = fromSheet(
	(sheet) => sheet.characters
);

export const selectSheetName: InventoryStoreSelector<string> = fromSheet(
	(s) => s.name
);

export const composeSelectEntityWithId = <
	Property extends FullSheetEntityProperty
>(
	id: string,
	property: Property
): InventoryStoreSelector<GetEntityByProperty<Property> | undefined> =>
	fromSheet(
		flow(D.getUnsafe(property), (entities) => [...entities].find(hasId(id)))
	);

export const composeSelectPropertyFilter =
	(
		property: FilterableItemProperty
	): InventoryStoreSelector<(string | null)[] | null> =>
	(state) =>
		state.ui.filters[property];

export const composeSelectItemWithId = (
	id: string
): InventoryStoreSelector<Item> =>
	fromSheet((sheet) => {
		const item = findObjectWithId(sheet.items, id);

		if (!item) throw new Error(`Item with id ${id} not found`);

		return item;
	});

export const composeSelectCharacterWithId = (
	id: string
): InventoryStoreSelector<Character | undefined> =>
	fromSheet((sheet) => {
		const character = findObjectWithId(sheet.characters, id);

		return character;
	});

export const composeSelectPropertyFilterMenuIsOpen =
	(property: FilterableItemProperty): InventoryStoreSelector<boolean> =>
	(state) =>
		state.ui.openFilterMenu === property;

export const selectItemBeingEdited: InventoryStoreSelector<Item | null> = (s) =>
	s.ui.itemDialog?.mode === "edit"
		? s.sheet.items.find(hasId(s.ui.itemDialog.itemId)) ?? null
		: null;

/**
 * Select all the possible values that can be applied to a
 * filterable property
 *
 * @param property The property to lookup
 */
export const composeSelectAllPossibleFilterValuesOnProperty = (
	property: FilterableItemProperty
): InventoryStoreSelector<(string | null)[]> =>
	fromSheet((sheet) =>
		getUniqueValuesOf(sheet.items, itemPropertyGetters[property])
	);

/**
 * Select the "effective" filter for a property (filter works by only
 * showing items that match the filter). If the filter for a property
 * is null, we actually treat it as if it held all possible values.
 * If it is not null, then we return the actual value.
 *
 * @param property The property of the filter to lookup
 */
export const composeSelectEffectivePropertyFilter =
	(
		property: FilterableItemProperty
	): InventoryStoreSelector<(string | null)[]> =>
	(state) => {
		const actualFilter = composeSelectPropertyFilter(property)(state);

		if (actualFilter === null) {
			// If the filters are empty (meaning the user can see all values) we
			// return all the possible values
			return composeSelectAllPossibleFilterValuesOnProperty(property)(state);
		}

		return actualFilter;
	};

const propertySorters: Record<
	SortableItemProperty,
	(sheet: FullSheet) => (item: Item) => any
> = {
	carriedByCharacterId: (sheet) => (item) =>
		sheet.items.find(hasId(item.id))?.name ?? "",
	name: () => itemPropertyGetters.name,
	category: () => itemPropertyGetters.category,
	weight:
		() =>
		({ weight, quantity }) =>
			new Big(weight ?? 0).times(quantity).toNumber(),
	value:
		() =>
		({ value, quantity }) =>
			new Big(value ?? 0).times(quantity).toNumber(),
	quantity: () => D.getUnsafe("quantity"),
};

const composeItemMatchesFilter =
	(state: InventoryStoreProps, property: FilterableItemProperty) =>
	(item: Item): boolean =>
		composeSelectEffectivePropertyFilter(property)(state).includes(
			itemPropertyGetters[property](item)
		);

const composeItemMatchesSearchValue =
	(state: InventoryStoreProps) =>
	(item: Item): boolean =>
		searchComparison(item.name, state.ui.searchBarValue);

const composeItemFilterFunction = (
	state: InventoryStoreProps
): Fn<[Item[]], Item[]> =>
	A.filter(
		F.allPass([
			composeItemMatchesFilter(state, "carriedByCharacterId"),
			composeItemMatchesFilter(state, "category"),
			composeItemMatchesSearchValue(state),
		])
	);

const composeItemSortFunction = (
	state: InventoryStoreProps
): Fn<[Item[]], Item[]> =>
	flow(
		(items) =>
			state.ui.sorting
				? A.sortBy(
						items,
						propertySorters[state.ui.sorting.property](state.sheet)
				  )
				: items,
		(items) =>
			state.ui.sorting?.direction === "ascending" ? items : A.reverse(items)
	);

export const selectVisibleItems: InventoryStoreSelector<Item[]> = (state) => {
	const filtration = composeItemFilterFunction(state);
	const sorting = composeItemSortFunction(state);

	return pipe(state.sheet.items, filtration, sorting);
};

export type ColumnSums = Record<NumericItemProperty, number>;

const getItemColumnSums = (items: Item[]) => {
	const sums: ColumnSums = {
		quantity: 0,
		value: 0,
		weight: 0,
	};

	for (const item of items) {
		sums.quantity += item.quantity;
		sums.value += getItemTotalValue(item);
		sums.weight += getItemTotalWeight(item);
	}

	const roundedSums = D.map(sums, (value) =>
		new Big(value).round(2).toNumber()
	);

	return roundedSums;
};

export const selectOverallColumnSums: InventoryStoreSelector<ColumnSums> = (
	state
) => getItemColumnSums(state.sheet.items);

type CharacterColumnSumsResult = {
	character: Character;
	sums: ColumnSums;
};

export const selectAllCharacterColumnTotals: InventoryStoreSelector<
	CharacterColumnSumsResult[]
> = (state) => {
	const result: CharacterColumnSumsResult[] = [];
	for (const character of state.sheet.characters) {
		const items = composeSelectCharacterWithIdCarriedItems(character.id)(state);
		result.push({
			character,
			sums: getItemColumnSums(items),
		});
	}
	return result;
};

export const composeSelectItemPropertyFilterHasValues = (
	property: FilterableItemProperty
): InventoryStoreSelector<boolean> =>
	flow(
		composeSelectAllPossibleFilterValuesOnProperty(property),
		A.reject(G.isNullable),
		A.isNotEmpty
	);

export const selectFilteringIsAvailable: InventoryStoreSelector<boolean> = (
	state
) =>
	A.any(FILTERABLE_ITEM_PROPERTIES, (property) =>
		composeSelectItemPropertyFilterHasValues(property)(state)
	);

export const selectAnyFilteringIsBeingDone: InventoryStoreSelector<boolean> = (
	state
) =>
	A.any(
		FILTERABLE_ITEM_PROPERTIES,
		(property) => composeSelectPropertyFilter(property)(state) !== null
	);
