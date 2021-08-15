import {
	getItemTotalValue,
	getItemTotalWeight,
} from "./../utils/deriveItemProperties";
import sort from "fast-sort";
import InventoryItemFields, {
	FilterableItemProperty,
	ProcessableItemProperty,
	SummableItemProperty,
} from "../types/InventoryItemFields";
import {
	createState as createHookstate,
	DevTools,
	useHookstate,
} from "@hookstate/core";
import toggleArrayItem from "@lukeboyle/array-item-toggle";
import unique from "uniq";
import {
	InventoryMemberDeleteMethodFields,
	SheetStateMembersUpdateQueue,
	InventoryMemberFieldsDeleteAction,
	DeleteMemberItemHandlingMethods,
} from "../types/InventorySheetState";
import Big from "big.js";
import InventoryMemberFields from "../types/InventoryMemberFields";
import { getCarrier } from "../utils/deriveItemProperties";
import { SortingDirection } from "../types/miscTypes";

export type SheetDialogType =
	| "item.new"
	| "item.edit"
	| "sheetOptions"
	| "filter"
	| "welcome";

export type InventoryFilters = Record<FilterableItemProperty, string[]>;

export const emptyFilters: InventoryFilters = {
	category: [],
	carriedBy: [],
};

export type ClientStateMemberUpdateQueue = {
	[Property in keyof Omit<SheetStateMembersUpdateQueue, "remove">]: string[];
} & { remove: InventoryMemberFieldsDeleteAction[] };
//? A version of 'SheetStateMembersUpdateQueue' with all field types except for 'remove' changed to 'string[]'

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
		direction: SortingDirection;
	};
	sheetMemberOptionsQueue: ClientStateMemberUpdateQueue;
	selectedSheetMemberRemoveMethod: InventoryMemberDeleteMethodFields["mode"];
	selectedSheetMemberRemovedMoveToMember: string;
}

const sheetPageState = createHookstate<SheetPageState>({
	dialog: {
		type: "item.new",
		activeItem: {
			_id: "",
			name: "",
			quantity: 0,
			weight: 0,
			carriedBy: "Nobody",
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
	sheetMemberOptionsQueue: {
		add: [],
		remove: [],
		update: [],
	},
	selectedSheetMemberRemoveMethod: DeleteMemberItemHandlingMethods.delete,
	selectedSheetMemberRemovedMoveToMember: "",
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
	 * @param members The party members in the sheet
	 * @returns Sorted/filtered inventory
	 * items
	 */
	const getProcessedItems = (
		items: InventoryItemFields[],
		members: InventoryMemberFields[]
	) => {
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
					case "carriedBy":
						return getCarrier(item, members)?.name;
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
		let result = [...sorted].filter((item) =>
			item.name
				.toLowerCase()
				.includes(state.ui.searchbarValue.value.toLowerCase())
		);
		for (const [property, filter] of Object.entries(state.filters.value)) {
			result = result.filter((item) => !filter.includes(item[property]));
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
		sheetMembersQueue: JSON.parse(
			JSON.stringify({ ...state.sheetMemberOptionsQueue.value })
		) as SheetPageState["sheetMemberOptionsQueue"],
		//? Not performing a stringify/parse copy here causes the app to crash
		selectedSheetMemberRemoveMethod:
			state.selectedSheetMemberRemoveMethod.value,
		selectedSheetMemberRemovedMoveToMember:
			state.selectedSheetMemberRemovedMoveToMember.value,

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
		getColumnSums: (
			items: InventoryItemFields[]
		): Record<SummableItemProperty, number> =>
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
		getUniqueCategories: (items: InventoryItemFields[]) =>
			unique(items.map((item) => item.category)).filter((item) => !!item),

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
			item: InventoryItemFields = { ...state.dialog.activeItem.value }
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
				//? Reset the sheet member options queue if it was the sheet options dialog that was closed
				state.sheetMemberOptionsQueue.set({
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
			state.filters.carriedBy.set([]);
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
		 * We 'queue' a party member in the sheet to be deleted.
		 * When the 'SheetOptions' dialog form is submitted, all
		 * members stored in the 'delete' queue will be deleted.
		 * If a member is queued to be removed, we first check if
		 * it is queued to be added, and if it is, we just remove
		 * it from the 'add' queue rather than adding it to the
		 * 'remove' queue
		 *
		 * @param _id The'_id' of the member to remove
		 * @param deleteMethod The method for handling
		 * items that were being carried by the member to be
		 * deleted
		 */
		queueMemberForRemove: (
			_id: string,
			deleteMethod: InventoryMemberDeleteMethodFields
		) => {
			let inPositiveQueue = false;
			[
				state.sheetMemberOptionsQueue.add,
				state.sheetMemberOptionsQueue.update,
			].forEach((positiveQueue) => {
				if (positiveQueue.value.includes(_id)) {
					inPositiveQueue = true;
					positiveQueue.set((value) =>
						value.filter((queuedMember) => queuedMember !== _id)
					);
				}
			});
			if (!inPositiveQueue) {
				state.sheetMemberOptionsQueue.remove.set((state) => [
					...state,
					{
						_id,
						carryCapacity: 0,
						name: "",
						deleteMethod,
					},
				]);
			}
		},

		/**
		 * Add a member to the queue to be added. When the sheet
		 * options dialog form is submitted, members in that form
		 * with '_id' values in this queue are sent to be added to
		 * the sheet.
		 *
		 * @param _id Thw '_id' of the member to add to the
		 * sheet
		 */
		queueMemberForAdd: (_id: string) => {
			state.sheetMemberOptionsQueue.add.set((value) => [...value, _id]);
		},

		/**
		 * Set the 'removeMethod' that is currently selected within the SheetOptions UI
		 */
		selectNewSheetMemberRemoveMethod: state.selectedSheetMemberRemoveMethod.set,

		/**
		 * Select the member that is currently selected to move an item to when a member
		 * is removed via the SheetOptions UI
		 */
		selectNewSheetMemberRemovedMoveToMember:
			state.selectedSheetMemberRemovedMoveToMember.set,
	};
};

export default sheetPageState;
