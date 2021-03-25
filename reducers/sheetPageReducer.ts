import produce from "immer";
import { Reducer } from "react";
import InventoryItemFields from "../types/InventoryItemFields";

export type SheetDialogType = "item.new" | "item.edit" | "sheetOptions";

export interface SheetPageState {
	dialog: {
		type: SheetDialogType;
		isOpen: boolean;
		activeItem: InventoryItemFields;
	};
}

interface OpenDialogAction {
	type: "dialog_open";
	data:
		| "item.new"
		| "sheetOptions"
		| {
				type: "item.edit";
				item: InventoryItemFields;
		  };
}

interface CloseDialogAction {
	type: "dialog_close";
}

export type SheetPageStateAction = OpenDialogAction | CloseDialogAction;

/**
 * Reducer for the state of the sheet page
 *
 * @param {SheetPageState} state The current state
 * @param {SheetPageStateAction} action The action to
 * be executed in order to produce the next state
 * @returns {SheetPageState} The next version of state
 */
const sheetPageReducer: Reducer<SheetPageState, SheetPageStateAction> = (
	state,
	action
) => {
	return produce(state, (draftState) => {
		if (action.type === "dialog_open") {
			if (typeof action.data !== "string") {
				draftState.dialog.type = action.data.type;
				draftState.dialog.activeItem = action.data.item;
			} else {
				draftState.dialog.type = action.data;
			}
			draftState.dialog.isOpen = true;
		} else if (action.type === "dialog_close") {
			draftState.dialog.isOpen = false;
		}
	});
};

/**
 * Find whether or not a certain dialog is currently open
 *
 * @param {SheetPageState} state The state
 * @param {SheetDialogType} dialogType The dialog to check
 * the status of
 * @returns {boolean} If the specified dialog should be
 * open
 */
export const selectDialogIsOpen = (
	state: SheetPageState,
	dialogType: SheetDialogType
): boolean => state.dialog.isOpen && state.dialog.type === dialogType;

export default sheetPageReducer;
