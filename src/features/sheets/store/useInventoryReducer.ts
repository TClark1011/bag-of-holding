import { useSheetRefetchEffect } from "$sheets/hooks";
import { inventoryReducer } from "$sheets/store";
import { FullSheet, FullSheetWithoutUpdatedAt } from "$sheets/types";
import { addToRememberedSheets, compareInventories } from "$sheets/utils";
import { useEffect, useReducer } from "react";

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
const useInventoryReducer = (sheetFields: FullSheetWithoutUpdatedAt) => {
	const [state, dispatch] = useReducer(inventoryReducer, {
		...sheetFields,
		blockRefetch: {
			for: 0,
			from: new Date(),
		},
	});
	const { id, name, characters } = state;

	useEffect(() => {
		addToRememberedSheets({ id, name, characters });
		// Store the sheet to the list of 'remembered' sheets
	}, [id, name, characters]);

	useSheetRefetchEffect((newData) => {
		if (!compareInventories(state, newData)) {
			dispatch({ type: "sheet_update", data: newData });
		}
	});

	return [state, dispatch] as const;
};

export default useInventoryReducer;
