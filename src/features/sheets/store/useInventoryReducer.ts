import { useSheetRefetchEffect } from "$sheets/hooks";
import { inventoryReducer } from "$sheets/store";
import {
	InventorySheetFields,
	InventorySheetState,
	InventorySheetStateAction,
} from "$sheets/types";
import { addToRememberedSheets, compareInventories } from "$sheets/utils";
import { Reducer, useEffect, useReducer } from "react";

/**
 * Initialises the sheet page state with
 * `useReducer` and returns the state and
 * dispatch object. Also manages the side
 * effects related to the sheet page state,
 * eg; re-fetching the sheet state from the
 * server.
 *
 * @param sheetFields The initial state of
 * the sheet
 * @returns The sheet page state and dispatch
 * function
 */
const useInventoryReducer = (sheetFields: InventorySheetFields) => {
	const [state, dispatch] = useReducer<
		Reducer<InventorySheetState, InventorySheetStateAction>
	>(inventoryReducer, {
		...sheetFields,
		blockRefetch: {
			for: 0,
			from: new Date(),
		},
	});
	const { _id, name, members } = state;

	useEffect(() => {
		addToRememberedSheets({ _id, name, members });
		// Store the sheet to the list of 'remembered' sheets
	}, [_id, name, members]);

	useSheetRefetchEffect((newData) => {
		if (!compareInventories(state, newData)) {
			dispatch({ type: "sheet_update", data: newData });
		}
	});

	return [state, dispatch] as const;
};

export default useInventoryReducer;
