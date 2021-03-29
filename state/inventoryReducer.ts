import { InventoryItemCreationFields } from "../types/InventoryItemFields";
import produce from "immer";
import { merge } from "merge-anything";
import InventoryItemFields from "../types/InventoryItemFields";
import InventorySheetFields from "../types/InventorySheetFields";
import InventorySheetState, {
	InventorySheetStateAction,
} from "../types/InventorySheetState";
import createInventoryItem from "../utils/createInventoryItem";

//TODO: Create separate 'server' reducer that processes how to update mongo state

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
const inventoryReducer = (
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
	 * @param {boolean} [blockRefetch=false] Whether or not
	 * to start blocking refetching
	 * @returns {InventorySheetState} The next state
	 */
	const produceNewState = (
		mutation: (p: typeof state) => void,
		blockRefetch = false
	) =>
		produce(state, (draftState) => {
			if (blockRefetch) {
				draftState.blockRefetch = {
					for: 4000,
					from: new Date(),
				};
			}
			mutation(draftState);
		});

	switch (type) {
		case "item_add":
			return produceNewState((draftState) => {
				draftState.items.push(
					createInventoryItem(data as InventoryItemCreationFields)
				);
			});
		case "item_remove":
			return produceNewState((draftState) => {
				draftState.items = draftState.items.filter(
					(item) => item._id !== (data as string)
				);
			}, true);
		case "item_update":
			return {
				...state,
				items: state.items.map((item) => {
					if (item._id === (data as InventoryItemFields)._id) {
						return data as InventoryItemFields;
					}
					return item;
				}),
			};
		case "sheet_update":
			//TODO: If a party member is deleted, set items that were being carried by them to being carried by nobody
			return merge(state, data as InventorySheetFields);
		case "sheet_metadataUpdate":
			return produceNewState((draftState) => {
				draftState.name = (data as { name: string }).name;
				draftState.members = (data as { members: string[] }).members;
			});
	}
};

/**
 * //TODO: Actions
 * Add member
 * Remove member
 * Update member
 */

export default inventoryReducer;
