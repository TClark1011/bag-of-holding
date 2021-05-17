import { REFETCH_INTERVAL } from "../config/publicEnv";
import produce from "immer";
import { merge } from "merge-anything";
import InventorySheetFields from "../types/InventorySheetFields";
import InventorySheetState, {
	DeleteMemberItemHandlingMethods,
	InventoryMemberDeleteMethodFields,
	InventorySheetStateAction,
} from "../types/InventorySheetState";
import createInventoryItem from "../utils/createInventoryItem";
import sendSheetAction from "../services/sendSheetAction";
import { logEvent, logException } from "../utils/analyticsHooks";
import codeToTitle from "code-to-title";
import stringifyObject from "stringify-object";
import getIds from "../utils/getIds";
import { memberIsCarrying } from "../utils/inventoryItemUtils";
import findObjectWithId from "../utils/findObjectWithId";

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

	if (action.type !== "sheet_metadataUpdate") {
		logEvent("Sheet", codeToTitle(action.type));
	}
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
				if (action.data.name) {
					logEvent("Sheet", "Changed Sheet Name");
					draftState.name = action.data.name;
				}
				draftState.members = draftState.members.filter(
					(member) => !getIds(action.data.members.remove).includes(member._id)
				);

				draftState.members = draftState.members.map((mem) =>
					getIds(action.data.members.update).includes(mem._id)
						? findObjectWithId(action.data.members.update, mem._id)
						: mem
				);

				action.data.members.remove.forEach((removingMember) => {
					logEvent("Sheet", "Deleted Sheet Member");
					switch (removingMember.deleteMethod.mode) {
						case DeleteMemberItemHandlingMethods.delete:
							draftState.items = draftState.items.filter(
								(item) => !memberIsCarrying(removingMember, item)
							);
							break;
						case DeleteMemberItemHandlingMethods.give:
							draftState.items = draftState.items.map((item) =>
								memberIsCarrying(removingMember, item)
									? {
										...item,
										carriedBy: (removingMember.deleteMethod as InventoryMemberDeleteMethodFields & {
												to: string;
											}).to,
										/**
										 * ? Have to use typecasting here even though it seems like I
										 * ? shouldn't have to. When I write out
										 * ? `removingMember.deleteMethod` underneath this case statement,
										 * ? typescript recognises that it has mode "move" and as such
										 * ? has a "to" field. But when I try to use "to" here, it insists,
										 * ? that mode is "remove" and therefore does not have a "to" field.
										 */
									  }
									: item
							);
							break;
						case DeleteMemberItemHandlingMethods.setToNobody:
							draftState.items = draftState.items.map((item) =>
								memberIsCarrying(removingMember, item)
									? { ...item, carriedBy: "Nobody" }
									: item
							);
					}
				});

				draftState.members = draftState.members.concat(action.data.members.add);
			}, true);
	}
};

export default inventoryReducer;
