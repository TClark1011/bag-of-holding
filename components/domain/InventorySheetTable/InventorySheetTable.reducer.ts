import produce from "immer";
import { Reducer } from "react";
import InventoryItemFields from "../../../types/InventoryItemFields";
import sort from "fast-sort";
import OmitId from "../../../utils/OmitId";
import { AccessibilityIcon } from "chakra-ui-ionicons";

export interface InventorySheetTableState {
	sorting: {
		property: keyof InventoryItemFields;
		direction: "ascending" | "descending";
	};
	filters: Record<keyof OmitId<InventoryItemFields>, string[]>;
}
//? Values included in filter arrays are omitted from item table
interface SortAction {
	type: "table_sort";
	data: keyof InventoryItemFields;
}

interface FilterAction {
	type: "table_filter";
	data: {
		property: keyof InventoryItemFields;
		value: string;
		filterOut: boolean;
	};
}

export type InventorySheetTableStateAction = SortAction | FilterAction;

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
			if (action.data.filterOut) {
				if (
					!draftState.filters[action.data.property].includes(action.data.value)
				) {
					draftState.filters[action.data.property].push(action.data.value);
				}
			} else {
				draftState.filters[action.data.property] = draftState.filters[
					action.data.property
				].filter((item) => item !== action.data.value);
			}
		}
	});
};

/**
 * Return item inventory with all sorts/filters applied
 *
 * @param {InventorySheetTableState} state The current state
 * @param {InventoryItemFields[]} items The items in the sheet
 * @returns {InventoryItemFields[]} The list of items
 */
export const selectProcessedItems = (
	{ sorting, filters }: InventorySheetTableState,
	items: InventoryItemFields[]
): InventoryItemFields[] => {
	const sortFn =
		sorting.direction === "ascending" ? sort(items).asc : sort(items).desc;

	const sorted = sortFn([
		(item) =>
			sorting.property === "quantity" || sorting.property === "weight"
				? (item[sorting.property] as number) * item.quantity
				: item[sorting.property],
		(item) => item.name,
	]);
	let result = sorted;
	for (const [property, filter] of Object.entries(filters)) {
		result = result.filter((item) => !filter.includes(item[property]));
	}
	return result;
	// return sorted;
};

export default inventorySheetTableReducer;
