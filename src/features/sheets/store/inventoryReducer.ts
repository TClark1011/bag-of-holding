import produce from "immer";
import { merge } from "merge-anything";
import {
	DeleteCharacterItemHandlingMethods,
	CharacterDeleteMethodFields,
	SheetStateAction,
	SheetState,
} from "$sheets/types";
import codeToTitle from "code-to-title";
import stringifyObject from "stringify-object";
import { findObjectWithId, getIds } from "$root/utils";
import { logEvent, logException } from "$analytics/utils";
import { characterIsCarrying, createInventoryItem } from "$sheets/utils";
import { sendSheetAction } from "$sheets/api";
import { REFETCH_INTERVAL } from "$root/config";
import { Sheet } from "@prisma/client";

/**
 * Reducer that handles updates to client state
 *
 * @param state The current  state of the inventory
 * @param action The action to be performed upon the state
 * @param action.type The type of action being performed
 * @param action.data Supplementary information
 * about how the action should be executed
 * @returns The state updated by the passed action
 */
const inventoryReducer = (
	state: SheetState,
	action: SheetStateAction
): SheetState => {
	if (action.sendToServer) {
		//? If send to server is true, we send the action to the server
		sendSheetAction(state.id, {
			...action,
			sendToServer: false,
		} as SheetStateAction).catch((err) => {
			logException(
				`Error occurred when sending sheet '${action.type}' action`,
				{
					fatal: true,
					extraData: stringifyObject({
						err: err.message,
						sheetId: state.id,
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
	 * @param mutation The function to execute
	 * to produce the next state via mutation
	 * @param [blockRefetch=false] Whether or not
	 * to start blocking refetching
	 * @returns The next state
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
					(item) => item.id !== action.data
				);
			}, true);
		case "item_update":
			return produceNewState((draftState) => {
				draftState.items.forEach((item, index) => {
					if (item.id === action.data.id) {
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
				draftState.characters = draftState.characters.filter(
					(member) => !getIds(action.data.characters.remove).includes(member.id)
				);

				draftState.characters = draftState.characters.map((mem) =>
					getIds(action.data.characters.update).includes(mem.id)
						? findObjectWithId(action.data.characters.update, mem.id)
						: mem
				);

				action.data.characters.remove.forEach((removingMember) => {
					logEvent(
						"Sheet",
						`Deleted Sheet Member (${removingMember.deleteMethod.mode})`
					);
					switch (removingMember.deleteMethod.mode) {
						case DeleteCharacterItemHandlingMethods.delete:
							draftState.items = draftState.items.filter(
								(item) => !characterIsCarrying(removingMember, item)
							);
							break;
						case DeleteCharacterItemHandlingMethods.give:
							draftState.items = draftState.items.map((item) =>
								characterIsCarrying(removingMember, item)
									? {
										...item,
										carriedByCharacterId: (removingMember.deleteMethod as CharacterDeleteMethodFields & {
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
						case DeleteCharacterItemHandlingMethods.setToNobody:
							draftState.items = draftState.items.map((item) =>
								characterIsCarrying(removingMember, item)
									? { ...item, carriedByCharacterId: "Nobody" }
									: item
							);
					}
				});

				draftState.characters = draftState.characters.concat(
					action.data.characters.add
				);
			}, true);
	}
};

export default inventoryReducer;
