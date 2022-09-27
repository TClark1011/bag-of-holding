import { sort } from "fast-sort";
import {
	FilterableItemProperty,
	ProcessableItemProperty,
	SummableItemProperty,
	CharacterDeleteMethodFields,
	CharacterDeleteAction,
	DeleteCharacterItemHandlingMethods,
	SheetStateCharactersUpdateQueue,
} from "$sheets/types";
import { SortingDirection } from "$root/types";
import {
	createState as createHookstate,
	DevTools,
	useHookstate,
} from "@hookstate/core";
import Big from "big.js";
import {
	getCarrier,
	getItemTotalValue,
	getItemTotalWeight,
	searchComparison,
} from "$sheets/utils";
import { Character, Item } from "@prisma/client";
import { toggleArrayItem } from "$root/utils";
import { A, D } from "@mobily/ts-belt";

export type SheetDialogType =
	| "item.new"
	| "item.edit"
	| "sheetOptions"
	| "filter"
	| "welcome";

export type InventoryFilters = Record<FilterableItemProperty, string[]>;

export const emptyFilters: InventoryFilters = {
	category: [],
	carriedByCharacterId: [],
};

export type ClientStateCharacterUpdateQueue = {
	[Property in keyof Omit<SheetStateCharactersUpdateQueue, "remove">]: string[];
} & { remove: CharacterDeleteAction[] };
//? A version of 'SheetStatecharactersUpdateQueue' with all field types except for 'remove' changed to 'string[]'

export interface SheetPageState {
	dialog: {
		type: SheetDialogType;
		isOpen: boolean;
		activeItem: Item;
	};
	filters: InventoryFilters;
	ui: {
		searchbarValue: string;
		openFilter: FilterableItemProperty | "none";
	};
	sorting: {
		property: ProcessableItemProperty;
		direction: SortingDirection;
	};
	sheetCharacterOptionsQueue: ClientStateCharacterUpdateQueue;
	selectedSheetCharacterRemoveMethod: CharacterDeleteMethodFields["mode"];
	selectedSheetCharacterRemovedMoveToCharacter: string;
}

const sheetPageState = createHookstate<SheetPageState>({
	dialog: {
		type: "item.new",
		activeItem: {
			id: "",
			name: "",
			quantity: 0,
			weight: 0,
			value: 0,
			carriedByCharacterId: null,
			category: null,
			description: null,
			referenceLink: null,
			sheetId: "",
		},
		isOpen: false,
	},
	filters: emptyFilters,
	sorting: {
		property: "name",
		direction: "ascending",
	},
	ui: {
		searchbarValue: "",
		openFilter: "none",
	},
	sheetCharacterOptionsQueue: {
		add: [],
		remove: [],
		update: [],
	},
	selectedSheetCharacterRemoveMethod: DeleteCharacterItemHandlingMethods.delete,
	selectedSheetCharacterRemovedMoveToCharacter: "",
});
DevTools(sheetPageState).label("sheetPageState");

/**
 * Hook to access sheet page state
 *
 * @returns Selectors and actions for sheet page
 * state
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useSheetPageState = () => {
	const state = useHookstate(sheetPageState);

	/**
	 * Sort/filter items according to the sort/filter state
	 *
	 * @param items The items in
	 * the sheet inventory
	 * @param characters The party characters in the sheet
	 * @returns Sorted/filtered inventory
	 * items
	 */
	const getProcessedItems = (items: Item[], characters: Character[]) => {
		const sorting = state.sorting.value;
		const sortFn =
			sorting.direction === "ascending"
				? sort([...items]).asc
				: sort([...items]).desc;
		//? have to use spread syntax because the sort function mutates and causes crash if passed values pulled straight from state

		//* Sort Items
		const sorted = sortFn([
			(item) => {
				switch (sorting.property) {
					case "carriedByCharacterId":
						return getCarrier(item, characters)?.name;
					case "value":
					case "weight":
						//? If 'quantity' or 'weight' are being sorted by, multiply them by the quantity
						return new Big(item[sorting.property] as number)
							.mul(new Big(item.quantity))
							.toNumber();
					default:
						return item[sorting.property];
				}
			},
			(item) => item.name,
			//? We add a second layer of sorting in the name property to ensure consistency when duplicate values exist in the same column
		]);

		//* Filter items
		// let result = [...sorted].filter((item) =>
		// 	item.name
		// 		.toLowerCase()
		// 		.includes(state.ui.searchbarValue.value.toLowerCase())
		let result = [...sorted].filter((item) =>
			searchComparison(item.name, state.ui.searchbarValue.value)
		);
		for (const [property, filter] of D.toPairs(state.filters.value)) {
			result = result.filter(
				(item) => !filter.includes(item[property as never])
			);
		}

		return result;
	};
	//? We define this function here so it can be used within selectors

	return {
		//# SELECTORS
		filters: { ...state.filters.value },
		sorting: { ...state.sorting.value },
		searchbarValue: state.ui.searchbarValue.value,
		activeItem: { ...state.dialog.activeItem.value },
		sheetCharactersQueue: JSON.parse(
			JSON.stringify({ ...state.sheetCharacterOptionsQueue.value })
		) as SheetPageState["sheetCharacterOptionsQueue"],
		//? Not performing a stringify/parse copy here causes the app to crash
		selectedSheetCharacterRemoveMethod:
			state.selectedSheetCharacterRemoveMethod.value,
		selectedSheetCharacterRemovedMoveToCharacter:
			state.selectedSheetCharacterRemovedMoveToCharacter.value,

		/**
		 * Check if a specific dialog is open
		 *
		 * @param dialog The dialog to check the status of
		 * @returns If the specified dialog is currently open
		 */
		isDialogOpen: (dialog: SheetDialogType): boolean =>
			state.value.dialog.type === dialog && state.value.dialog.isOpen,

		/**
		 * Check whether or not the filter Popover interface for a specific
		 * property is currently open
		 *
		 * @param filter The property to check the
		 * filter of
		 * @returns If the specified filter popover is currently open
		 */
		isFilterPopoverOpen: (filter: FilterableItemProperty): boolean =>
			state.ui.openFilter.value === filter,

		/**
		 * Fetch the sorted/filtered items
		 */
		getProcessedItems,

		/**
		 * Calculate the sums for the processed items that
		 * will be shown in the bottom column of the item
		 * table.
		 *
		 * @param items The items in
		 * the sheet inventory
		 * @returns An
		 * object containing the sums
		 */
		getColumnSums: (items: Item[]): Record<SummableItemProperty, number> =>
			getProcessedItems(items, []).reduce<Record<SummableItemProperty, number>>(
				(current, item) => ({
					weight: new Big(current.weight || 0)
						.add(new Big(getItemTotalWeight(item)))
						.toNumber(),
					value: new Big(current.value || 0)
						.add(new Big(getItemTotalValue(item)))
						.toNumber(),
				}),
				{
					weight: 0,
					value: 0,
				}
			),

		/**
		 * Fetch all the different values of item categories in
		 * the inventory
		 *
		 * @param items The inventory items
		 * @returns An array of all the unique category
		 * values
		 */
		getUniqueCategories: (items: Item[]) =>
			A.uniq(items.map((item) => item.category)).filter((item) => !!item),

		//# ACTIONS
		/**
		 * Open a dialog
		 *
		 * @param dialog The name of the dialog to open
		 * @param [item] The item to set as the active
		 * item. If not provided, activeItem remains the same
		 */
		openDialog: (
			dialog: SheetDialogType,
			item: Item = { ...state.dialog.activeItem.value }
		) => {
			state.dialog.set({
				type: dialog,
				activeItem: { ...item },
				isOpen: true,
			});
		},

		/**
		 * Close dialog
		 */
		closeDialog: () => {
			state.dialog.isOpen.set(false);
			if (state.dialog.type.value === "sheetOptions") {
				//? Reset the sheet character options queue if it was the sheet options dialog that was closed
				state.sheetCharacterOptionsQueue.set({
					add: [],
					remove: [],
					update: [],
				});
			}
		},

		/**
		 * Update the sheet filter
		 *
		 * @param property The property of which
		 * to update the filter
		 * @param value The value to update the filter with
		 */
		updateFilter: (property: FilterableItemProperty, value: string) => {
			state.filters[property].set(
				toggleArrayItem(state.filters[property].value, value)
			);
		},

		/**
		 * Reset the filters
		 */
		resetFilters: () => {
			state.filters.carriedByCharacterId.set([]);
			state.filters.category.set([]);
		},

		/**
		 * Reset the filter for an individual property
		 *
		 * @param property The property of which
		 * to reset the filter.
		 */
		resetPropertyFilter: (property: FilterableItemProperty) => {
			state.filters[property].set([]);
		},

		/**
		 * The 'onChange' handler for the search bar. Updates
		 * the state's 'searchBarValue' ui field with new
		 * value
		 *
		 * @param e The
		 * change event fired by input into the search bar
		 */
		searchbarOnChange: (e: React.ChangeEvent<HTMLInputElement>) => {
			state.ui.searchbarValue.set(e.target.value);
		},

		/**
		 * Open a filter Popover
		 *
		 * @param filter The filter of which
		 * to open the Popover
		 */
		openFilterPopover: (filter: FilterableItemProperty) => {
			state.ui.openFilter.set(filter);
		},

		/**
		 * Close the currently open filter popover
		 */
		closeFilterPopover: () => {
			state.ui.openFilter.set("none");
		},

		/**
		 * Sort the inventory
		 *
		 * @param column The column to sort.
		 * @param [direction="auto"] The direction to sort in.
		 * If set to "auto" then the direction will be the inverse
		 * of the direction the item is currently being sorted by.
		 */
		sortInventory: (
			column: ProcessableItemProperty,
			direction: SortingDirection | "auto" = "auto"
		) => {
			if (state.sorting.property.value === column) {
				state.sorting.direction.set(
					direction === "auto"
						? state.sorting.direction.value === "ascending"
							? "descending"
							: "ascending"
						: direction
					//? If sorting the column that is already being sorted, flip the sort direction
				);
			} else {
				state.sorting.property.set(column);
				state.sorting.direction.set(
					direction === "auto" ? "ascending" : direction
				);
			}
		},

		/**
		 * We 'queue' a party character in the sheet to be deleted.
		 * When the 'SheetOptions' dialog form is submitted, all
		 * characters stored in the 'delete' queue will be deleted.
		 * If a character is queued to be removed, we first check if
		 * it is queued to be added, and if it is, we just remove
		 * it from the 'add' queue rather than adding it to the
		 * 'remove' queue
		 *
		 * @param id The'id' of the character to remove
		 * @param deleteMethod The method for handling
		 * items that were being carried by the character to be
		 * deleted
		 */
		queueCharacterForRemove: (
			id: string,
			deleteMethod: CharacterDeleteMethodFields
		) => {
			let inPositiveQueue = false;
			[
				state.sheetCharacterOptionsQueue.add,
				state.sheetCharacterOptionsQueue.update,
			].forEach((positiveQueue) => {
				if (positiveQueue.value.includes(id)) {
					inPositiveQueue = true;
					positiveQueue.set((value) =>
						value.filter((queuedCharacter) => queuedCharacter !== id)
					);
				}
			});
			if (!inPositiveQueue) {
				state.sheetCharacterOptionsQueue.remove.set((state) => [
					...state,
					{
						id: id,
						carryCapacity: 0,
						name: "",
						deleteMethod,
						sheetId: "",
					},
				]);
			}
		},

		/**
		 * Add a character to the queue to be added. When the sheet
		 * options dialog form is submitted, characters in that form
		 * with 'id' values in this queue are sent to be added to
		 * the sheet.
		 *
		 * @param id Thw 'id' of the character to add to the
		 * sheet
		 */
		queueCharacterForAdd: (id: string) => {
			state.sheetCharacterOptionsQueue.add.set((value) => [...value, id]);
		},

		/**
		 * Set the 'removeMethod' that is currently selected within the SheetOptions UI
		 */
		selectNewSheetCharacterRemoveMethod:
			state.selectedSheetCharacterRemoveMethod.set,

		/**
		 * Select the character that is currently selected to move an item to when a character
		 * is removed via the SheetOptions UI
		 */
		selectNewSheetCharacterRemovedMoveToCharacter:
			state.selectedSheetCharacterRemovedMoveToCharacter.set,
	};
};

export default sheetPageState;
