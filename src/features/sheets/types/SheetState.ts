import { ItemCreationFields, FullSheetWithoutUpdatedAt } from "$sheets/types";
import { Character, Sheet } from "@prisma/client";

/**
 * @typedef {object} SheetStateActionTemplate A template interface
 * for defining actions upon a sheet's state
 * @template T The string of the type of action
 * @template D The type of data the action will contain in its payload
 * @readonly
 * @property {T} type The name of the type of action
 * @readonly
 * @property {D} data The action's payload data
 * @readonly
 * @property {boolean} [sendToServer] Whether or not the action should be
 * sent to the server
 * @readonly
 * @property {Function} [onFinally] Callback executed in the '.finally'
 * callback of the request sending the action to the server
 * @readonly
 * @property {Function} [onCatch] Callback executed in the '.catch'
 * callback of the request sending the action to the server. Is passed
 * the error object that triggers the catch
 * @readonly
 * @property {Function} [onThen] Callback executed in the '.then'
 * callback of the request sending the action to the server
 */
export interface SheetStateActionTemplate<T extends string, D> {
	readonly type: T;
	readonly data: D;
	readonly sendToServer?: boolean;
	readonly onFinally?: () => void;
	readonly onCatch?: (err?: Error) => void;
	readonly onThen?: () => void;
}

/**
 * Action for adding an item to sheet inventory
 */
export type AddItemAction = SheetStateActionTemplate<
	"item_add",
	ItemCreationFields
>;

/**
 * Action for removing an item from sheet inventory
 */
export type RemoveItemAction = SheetStateActionTemplate<"item_remove", string>;
/**
 * Action for setting whether or not sheet state is ahead of server state
 */
export type UpdateItemAction = SheetStateActionTemplate<
	"item_update",
	Partial<ItemCreationFields>
>;

/**
 * Action for completely updating a sheet's state
 */
export type UpdateSheetAction = SheetStateActionTemplate<
	"sheet_update",
	Omit<Sheet, "id" | "updatedAt">
>;

/**
 * Extra information on how items being carried
 * by a character that is being removed should be
 * handled.
 *
 * Modes:
 * - delete: Any items being carried by the
 * character being removed will be removed from
 * the sheet.
 * - give: Move the items being carried by the
 * removed character to another character
 * - setToNobody: Items being carried by the
 * removed user will have there "carriedByCharacterId" field
 * set to "nobody"
 */
export enum DeleteCharacterItemHandlingMethods {
	delete = "delete",
	give = "give",
	setToNobody = "setToNobody",
}

export type CharacterDeleteMethodTemplate<Mode extends string> = {
	mode: Mode;
};

export type CharacterMoveDeleteMethod = CharacterDeleteMethodTemplate<DeleteCharacterItemHandlingMethods.give> & {
	to: string;
};

/**
 * Type guard to confirm if a delete method is the "move"
 * method
 *
 * @param deleteMethod the delete method to check
 */
export const isMoveDeleteMethod = (
	deleteMethod: CharacterDeleteMethodTemplate<string>
): deleteMethod is CharacterMoveDeleteMethod => "to" in deleteMethod;

export type CharacterRemoveDeleteMethod = CharacterDeleteMethodTemplate<DeleteCharacterItemHandlingMethods.delete>;
export type CharacterSetToNobodyDeleteMethod = CharacterDeleteMethodTemplate<DeleteCharacterItemHandlingMethods.setToNobody>;

export type CharacterDeleteMethodFields =
	| CharacterMoveDeleteMethod
	| CharacterRemoveDeleteMethod
	| CharacterSetToNobodyDeleteMethod;

export interface CharacterDeleteAction extends Character {
	deleteMethod: CharacterDeleteMethodFields;
}

export type SheetStateCharactersUpdateQueue = {
	add: Character[];
	remove: CharacterDeleteAction[];
	update: Character[];
};

export type UpdateSheetMetaDataAction = SheetStateActionTemplate<
	"sheet_metadataUpdate",
	{
		characters: SheetStateCharactersUpdateQueue;
		name: string;
	}
>;

/**
 * An action that performs a partial update on a sheet
 * Used for backend database reducer
 */
export type SheetStatePartialUpdateAction =
	| AddItemAction
	| RemoveItemAction
	| UpdateItemAction
	| UpdateSheetMetaDataAction;

/**
 * Action that can be executed to mutate frontend state
 * of a sheet.
 */
export type SheetStateAction =
	| SheetStatePartialUpdateAction
	| UpdateSheetAction;

/**
 * @typedef {object} InventorySheetState Holds the local state of an inventory sheet
 * @augments Sheet Extends the base inventory sheet, adding extra
 * information related to the state of the application.
 * @property {object} blockRefetch Information about how to block refetching
 * @property {number} blockRefetch.for The number of milliseconds to block
 * refetching
 * @property {Date} blockRefetch.from The timestamp from which to start blocking
 * refetching
 */
type SheetState = FullSheetWithoutUpdatedAt & {
	blockRefetch?: {
		for: number;
		from: Date;
	};
};

export default SheetState;
