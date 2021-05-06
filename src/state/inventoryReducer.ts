import { REFETCH_INTERVAL } from "../config/publicEnv";
import produce from "immer";
import { merge } from "merge-anything";
import InventorySheetFields from "../types/InventorySheetFields";
import InventorySheetState, {
	InventorySheetStateAction,
} from "../types/InventorySheetState";
import createInventoryItem from "../utils/createInventoryItem";
import sendSheetAction from "../services/sendSheetAction";
import { logEvent, logException } from "../utils/analyticsHooks";
import codeToTitle from "code-to-title";
import stringifyObject from "stringify-object";
import getIds from "../utils/getIds";

/**
 * Reducer that handles updates to client state
 *
 * @param {InventoryItemFields[]} state The current  state of the inventory
 * @param {InventoryStateAction} action The action to be performed upon the state
 * @param {InventoryStateActionType} action.type The type of action being performed
 * @param {InventoryStateActionValidData} action.data Supplementary information
 * about how the action should be executed
 * @returns {InventoryItemFields[]} The state updated by the passed action
 */
const inventoryReducer = (
	state: InventorySheetState,
	action: InventorySheetStateAction
): InventorySheetFields => {
	if (action.sendToServer) {
		//? If send to server is true, we send the action to the server
		sendSheetAction(state._id, {
			...action,
			sendToServer: false,
		} as InventorySheetStateAction).catch((err) => {
			logException(
				`Error occurred when sending sheet '${action.type}' action`,
				{
					fatal: true,
					extraData: stringifyObject({
						err: err.message,
						sheetId: state._id,
						action,
					}),
				}
			);
		});
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
					for: REFETCH_INTERVAL + 1000,
					from: new Date(),
				};
			}
			mutation(draftState);
		});

	logEvent("Sheet", codeToTitle(action.type));
	//? Log the action in google analytics

	switch (action.type) {
		case "item_add":
			return produceNewState((draftState) => {
				draftState.items.push(createInventoryItem(action.data));
			});
		case "item_remove":
			return produceNewState((draftState) => {
				draftState.items = draftState.items.filter(
					(item) => item._id !== action.data
				);
			}, true);
		case "item_update":
			return produceNewState((draftState) => {
				draftState.items.forEach((item, index) => {
					if (item._id === action.data._id) {
						draftState.items[index] = {
							...draftState.items[index],
							...action.data,
						};
					}
				});
			}, true);
		case "sheet_update":
			if (
				!state.blockRefetch ||
				(state.blockRefetch &&
					new Date().getTime() - state.blockRefetch.from.getTime() >
						state.blockRefetch.for)
				//? If not currently blocking refetch...
			) {
				return merge(state, action.data);
			}
			return state;
		case "sheet_metadataUpdate":
			return produceNewState((draftState) => {
				draftState.name = action.data.name;
				draftState.members = draftState.members.filter(
					(member) => !getIds(action.data.members.remove).includes(member._id)
				);

				action.data.members.remove.forEach((removingMember) => {
					switch (removingMember.deleteMethod.mode) {
						case "remove":
							draftState.items = draftState.items.filter(
								(item) => item.carriedBy !== removingMember._id
							);
							break;
						case "move":
							console.warn("must implement item moving");
							break;
					}
				});

				draftState.members = draftState.members.concat(action.data.members.add);
			}, true);
	}
};

export default inventoryReducer;
