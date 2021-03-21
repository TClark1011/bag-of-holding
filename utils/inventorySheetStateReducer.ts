import produce from "immer";
import InventoryItemFields from "../types/InventoryItemFields";
import InventorySheetFields from "../types/InventorySheetFields";
import InventorySheetState, {
	InventorySheetStateAction,
} from "../types/InventorySheetState";
import createInventoryItem from "./createInventoryItem";

// const conditionallySendToServer = (
// 	sendToServer: boolean,
// 	action: InventorySheetStateAction
// ): void => {
// 	if (sendToServer) {
// 		fetch("/api/" + 1)
// 			.then(() => action.onThen && action.onThen())
// 			.catch((err) => action.onCatch && action.onCatch(err))
// 			.finally(() => action.onFinally && action.onFinally());
// 	}
// };

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
		fetch("/api/" + 1, {
			method: "PATCH",
			body: JSON.stringify({ type, data, sendToServer: false }),
		})
			.then(() => onThen && onThen())
			.catch((err) => onCatch && onCatch(err))
			.finally(() => onFinally && onFinally());
	}
	switch (type) {
		case "item_add":
			return produce(state, (draftState) => {
				draftState.items.push(createInventoryItem(data as InventoryItemFields));
			});
		case "item_remove":
			return produce(state, (draftState) => {
				draftState.items = draftState.items.filter(
					(item) => item._id !== (data as string)
				);
			});
		case "sheet_update":
			return produce(state, (draftState) => ({
				...draftState,
				...(data as InventorySheetFields),
			}));
	}
};

export default inventoryStateReducer;
