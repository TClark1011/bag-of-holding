import produce from "immer";
import InventoryItemFields from "../types/InventoryItemFields";
import InventorySheetFields from "../types/InventorySheetFields";
import InventorySheetState, {
	InventorySheetStateAction,
} from "../types/InventorySheetState";
import createInventoryItem from "./createInventoryItem";

/**
 * The reducer for a sheet's inventory state
 *
 * @param {InventoryItemFields[]} state The current  ate of the inventory
 * @param {InventoryStateAction} action The action to be performed upon the state
 * @param {InventoryStateActionType} action.type The type of action being performed
 * @param {InventoryStateActionValidData} action.data Supplementary information
 * about how the action should be executed
 * @returns {InventoryItemFields[]} The state updated by the passed action
 */
const inventoryStateReducer = (
	state: InventorySheetState,
	{
		type,
		data,
		sendToServer,
		onThen,
		onCatch,
		onFinally,
	}: InventorySheetStateAction
): InventorySheetFields => {
	if (sendToServer) {
		//? If send to server is true, we send the action to the server
		fetch("/api/" + state._id, {
			method: "PATCH",
			body: JSON.stringify({ type, data, sendToServer: false }),
			//? We set 'sendToServer' to false when sending the action to the server to prevent an infinite loop
		})
			.then(() => onThen && onThen())
			.catch((err) => onCatch && onCatch(err))
			.finally(() => onFinally && onFinally());
	}

	/**
	 * Shorthand for calling the immer 'produce' function,
	 * passing the state as the first parameter
	 *
	 * @param {Function} mutation The function to execute
	 * to produce the next state via mutation
	 * @param {boolean} [setIsAhead=false] If true, mark the
	 * state as being ahead of the server state.
	 * @returns {InventorySheetState} The next state
	 */
	const produceNewState = (
		mutation: (p: typeof state) => void,
		setIsAhead = false
	) =>
		produce(state, (draftState) => {
			if (setIsAhead) {
				draftState.isAhead = true;
			}
			mutation(draftState);
		});

	switch (type) {
		case "item_add":
			return produceNewState((draftState) => {
				draftState.items.push(createInventoryItem(data as InventoryItemFields));
			}, true);
		case "item_remove":
			return produceNewState((draftState) => {
				draftState.items = draftState.items.filter(
					(item) => item._id !== (data as string)
				);
			}, true);
		case "sheet_update":
			return produceNewState((draftState) => ({
				...draftState,
				...(data as InventorySheetFields),
			}));
		case "sheet_setIsAhead":
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			return produceNewState(() => {}, true);
	}
};

export default inventoryStateReducer;
