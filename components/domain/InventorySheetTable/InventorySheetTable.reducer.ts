import produce from "immer";
import { Reducer } from "react";
import InventoryItemFields from "../../../types/InventoryItemFields";
import sort from "fast-sort";

export interface InventorySheetTableState {
	sorting: {
		property: keyof InventoryItemFields;
		direction: "ascending" | "descending";
	};
}

interface SortAction {
	type: "table_sort";
	data: keyof InventoryItemFields;
}

export type InventorySheetTableStateAction = SortAction;

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
	{ sorting }: InventorySheetTableState,
	items: InventoryItemFields[]
): InventoryItemFields[] => {
	const sortFn =
		sorting.direction === "ascending" ? sort(items).asc : sort(items).desc;

	return sortFn([
		(item) =>
			sorting.property === "quantity" || sorting.property === "weight"
				? (item[sorting.property] as number) * item.quantity
				: item[sorting.property],
		(item) => item.name,
	]);
};

export default inventorySheetTableReducer;
