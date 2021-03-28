import sort from "fast-sort";
import InventoryItemFields, {
	FilterableItemProperty,
	ProcessableItemProperty,
	SummableItemProperty,
} from "../types/InventoryItemFields";
import { createState as createHookstate, useHookstate } from "@hookstate/core";
import toggleArrayItem from "@lukeboyle/array-item-toggle";

export type SheetDialogType =
	| "item.new"
	| "item.edit"
	| "sheetOptions"
	| "filter";

export type InventoryFilters = Record<FilterableItemProperty, string[]>;

export const emptyFilters: InventoryFilters = {
	category: [],
	carriedBy: [],
};

export interface SheetPageState {
	dialog: {
		type: SheetDialogType;
		isOpen: boolean;
		activeItem: InventoryItemFields;
	};
	filters: InventoryFilters;
	ui: {
		searchbarValue: string;
		openFilter: FilterableItemProperty | "none";
	};
	sorting: {
		property: ProcessableItemProperty;
		direction: "ascending" | "descending";
	};
}

export const sheetPageState = createHookstate<SheetPageState>({
	dialog: {
		type: "item.new",
		activeItem: {
			_id: "",
			name: "",
			quantity: 0,
			weight: 0,
			carriedBy: "Nobody",
			category: "None",
			reference: "",
			description: "",
			value: 0,
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
});

/**
 * Hook to access sheet page state
 *
 * @returns {object} Selectors and actions for sheet page
 * state
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useSheetPageState = () => {
	const state = useHookstate(sheetPageState);

	/**
	 * Sort/filter items according to the sort/filter state
	 *
	 * @param {InventoryItemFields[]} items The items in
	 * the sheet inventory
	 * @returns {InventoryItemFields[]} Sorted/filtered inventory
	 * items
	 */
	const getProcessedItems = (items: InventoryItemFields[]) => {
		const sorting = state.sorting.value;
		const sortFn =
			sorting.direction === "ascending"
				? sort([...items]).asc
				: sort([...items]).desc;
		//? have to use spread syntax because the sort function mutates and causes crash if passed values pulled straight from state

		//* Sort Items
		const sorted = sortFn([
			(item) =>
				sorting.property === "quantity" || sorting.property === "weight"
					? (item[sorting.property] as number) * item.quantity
					: item[sorting.property],
			(item) => item.name,
			//? We add a second layer of sorting in the name property to ensure consistency when duplicate values exist in the same column
		]);

		//* Filter items
		let result = [...sorted].filter((item) =>
			item.name.includes(state.ui.searchbarValue.value)
		);
		for (const [property, filter] of Object.entries(state.filters.value)) {
			result = result.filter((item) => !filter.includes(item[property]));
		}

		return result;
	};
	//? We define this function here so it can be used within selectors

	return {
		//# SELECTORS
		searchbarValue: state.ui.searchbarValue.value,
		activeItem: { ...state.value.dialog.activeItem },

		/**
		 * Check if a specific dialog is open
		 *
		 * @param {SheetDialogType} dialog The dialog to check the status of
		 * @returns {boolean} If the specified dialog is currently open
		 */
		isDialogOpen: (dialog: SheetDialogType) =>
			state.value.dialog.type === dialog && state.value.dialog.isOpen,

		/**
		 * Fetch the sorted/filtered items
		 */
		getProcessedItems,

		/**
		 * Calculate the sums for the processed items that
		 * will be shown in the bottom column of the item
		 * table.
		 *
		 * @param {InventoryItemFields[]} items The items in
		 * the sheet inventory
		 * @returns {Record<SummableItemProperty, number>} An
		 * object containing the sums
		 */
		getColumnSums: (
			items: InventoryItemFields[]
		): Record<SummableItemProperty, number> => {
			const result = {
				weight: 0,
				value: 0,
			};

			getProcessedItems(items).forEach((item) => {
				result.value += item.value;
				result.weight += item.weight;
			});

			return result;
		},

		//# ACTIONS
		/**
		 * Open a dialog
		 *
		 * @param {SheetDialogType} dialog The name of the dialog to open
		 * @param {InventoryItemFields} [item] The item to set as the active
		 * item. If not provided, activeItem remains the same
		 */
		openDialog: (
			dialog: SheetDialogType,
			item: InventoryItemFields = { ...state.dialog.activeItem.value }
		) => {
			state.dialog.set({
				type: dialog,
				activeItem: item,
				isOpen: true,
			});
		},

		/**
		 * Close dialog
		 */
		closeDialog: () => {
			state.dialog.merge({ isOpen: false });
		},

		/**
		 * Update the sheet filter
		 *
		 * @param {FilterableItemProperty} property The property of which
		 * to update the filter
		 * @param {string} value The value to update the filter with
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
			state.filters.set(emptyFilters);
		},

		/**
		 * The 'onChange' handler for the search bar. Updates
		 * the state's 'searchBarValue' ui field with new
		 * value
		 *
		 * @param {React.ChangeEvent<HTMLInputElement>} e The
		 * change event fired by input into the search bar
		 */
		searchbarOnChange: (e: React.ChangeEvent<HTMLInputElement>) => {
			state.ui.searchbarValue.set(e.target.value);
		},

		/**
		 * Open a filter Popover
		 *
		 * @param {FilterableItemProperty} filter The filter of which
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
		 * Sort the table
		 *
		 * @param {ProcessableItemProperty} column The column
		 * to sort.
		 */
		sortTable: (column: ProcessableItemProperty) => {
			if (state.sorting.property.value === column) {
				state.sorting.direction.set(
					state.sorting.direction.value === "ascending"
						? "descending"
						: "ascending"
					//? If sorting the column that is already being sorted, flip the sort direction
				);
			} else {
				state.sorting.property.set(column);
				state.sorting.direction.set("ascending");
			}
		},
	};
};
