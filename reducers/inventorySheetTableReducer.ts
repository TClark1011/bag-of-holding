import produce from "immer";
import { Reducer } from "react";
import InventoryItemFields, {
	ProcessableItemProperty,
} from "../types/InventoryItemFields";
import sort from "fast-sort";

export interface InventorySheetTableState {
	sorting: {
		property: ProcessableItemProperty;
		direction: "ascending" | "descending";
	};
	filters: Record<ProcessableItemProperty, string[]>;
	ui: {
		openFilter: ProcessableItemProperty | false;
	};
}
//? Values included in filter arrays are omitted from item table
interface SortAction {
	type: "table_sort";
	data: ProcessableItemProperty;
}

interface FilterAction {
	type: "table_filter";
	data: {
		property: ProcessableItemProperty;
		value: string;
	};
}

interface OpenFilterAction {
	type: "ui_openFilter";
	data: ProcessableItemProperty;
}
interface CloseFilterAction {
	type: "ui_closeFilter";
}

export type InventorySheetTableStateAction =
	| SortAction
	| FilterAction
	| OpenFilterAction
	| CloseFilterAction;

/**
 * The reducer for the state of the 'InventorySheetTable'
 * component
 *
 * @param {InventorySheetTableState} state The current state
 * of the component
 * @param {InventorySheetTableStateAction} action The action
 * that will performed upon the current state to produce the next
 * version of state.
 * @returns {InventorySheetTableState} The updated state
 */
const inventorySheetTableReducer: Reducer<
	InventorySheetTableState,
	InventorySheetTableStateAction
> = (state, action) => {
	return produce(state, (draftState) => {
		if (action.type === "table_sort") {
			//# Execute Table Sort Action
			if (draftState.sorting.property === action.data) {
				draftState.sorting.direction =
					draftState.sorting.direction === "ascending"
						? "descending"
						: "ascending";
				//? Just flip the sorting direction if the action property is already the sorted property
			} else {
				draftState.sorting.direction = "ascending";
				draftState.sorting.property = action.data;
				//? If sorting by a new property, set direction to ascending and set new property;
			}
		} else if (action.type === "table_filter") {
			//# Execute Table Filter Action
			if (
				!draftState.filters[action.data.property].includes(action.data.value)
			) {
				draftState.filters[action.data.property].push(action.data.value);
			} else {
				draftState.filters[action.data.property] = draftState.filters[
					action.data.property
				].filter((item) => item !== action.data.value);
			}
		} else if (action.type === "ui_openFilter") {
			draftState.ui.openFilter = action.data;
		} else if (action.type === "ui_closeFilter") {
			draftState.ui.openFilter = false;
		}
	});
};

type Selector<T, R> = (state: InventorySheetTableState, data: T) => R;

/**
 * Return item inventory with all sorts/filters applied
 *
 * @param {InventorySheetTableState} state The current state
 * @param {InventoryItemFields[]} items The items in the sheet
 * @returns {InventoryItemFields[]} The list of items
 */
export const selectProcessedItems: Selector<
	InventoryItemFields[],
	InventoryItemFields[]
> = ({ sorting, filters }, items) => {
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
	]);

	//* Filter items
	let result = [...sorted];
	for (const [property, filter] of Object.entries(filters)) {
		result = result.filter((item) => !filter.includes(item[property]));
	}
	return result;
};

/**
 * Find out whether or not the filter interface for a specified property
 * is currently open.
 *
 * @param {InventorySheetTableState} state The current state
 * @param {ProcessableItemProperty} property The property to check the
 * ui interface state for.
 * @returns {boolean} Whether or not the filter interface for the specified property
 * is currently open.
 */
export const selectFilterUiIsOpen: Selector<
	ProcessableItemProperty,
	boolean
> = (state, property) => state.ui.openFilter === property;
export default inventorySheetTableReducer;
