import produce from "immer";
import { Reducer } from "react";
import InventoryItemFields from "../../../types/InventoryItemFields";

interface SortState {
	property: keyof InventoryItemFields;
	direction: "ascending" | "descending";
}

export interface InventorySheetTableState {
	sorting: SortState;
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

export default inventorySheetTableReducer;
