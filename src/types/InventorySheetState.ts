import { InventoryItemCreationFields } from "./InventoryItemFields";
import InventoryMemberFields from "./InventoryMemberFields";
import InventorySheetFields from "./InventorySheetFields";

/**
 * @typedef {object} InventorySheetStateActionTemplate A template interface
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
export interface InventorySheetStateActionTemplate<T extends string, D> {
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
export type AddItemAction = InventorySheetStateActionTemplate<
	"item_add",
	InventoryItemCreationFields
>;

/**
 * Action for removing an item from sheet inventory
 */
export type RemoveItemAction = InventorySheetStateActionTemplate<
	"item_remove",
	string
>;
/**
 * Action for setting whether or not sheet state is ahead of server state
 */
export type UpdateItemAction = InventorySheetStateActionTemplate<
	"item_update",
	InventoryItemCreationFields
>;

/**
 * Action for completely updating a sheet's state
 */
export type UpdateSheetAction = InventorySheetStateActionTemplate<
	"sheet_update",
	Omit<InventorySheetFields, "_id">
>;

export type InventoryMemberDeleteMethodTemplate<ModeName extends string> = {
	mode: ModeName;
};

export type InventoryMemberMoveDeleteMethod = InventoryMemberDeleteMethodTemplate<"move"> & {
	to: string;
};
export type InventoryMemberRemoveDeleteMethod = InventoryMemberDeleteMethodTemplate<"remove">;
export type InventoryMemberSetToNobodyDeleteMethod = InventoryMemberDeleteMethodTemplate<"setToNobody">;

/**
 * Extra information on how items being carried
 * by a member that is being removed should be
 * handled.
 *
 * Modes:
 * - "remove": Any items being carried by the
 * member being removed will be removed from
 * the sheet.
 * - "move": Move the items being carried by the
 * removed member to another member
 * - "setToNobody": Items being carried by the
 * removed user will have there "carriedBy" field
 * set to "nobody"
 */
export type InventoryMemberDeleteMethodFields =
	| InventoryMemberMoveDeleteMethod
	| InventoryMemberRemoveDeleteMethod
	| InventoryMemberSetToNobodyDeleteMethod;
export interface InventoryMemberFieldsDeleteAction
	extends InventoryMemberFields {
	deleteMethod: InventoryMemberDeleteMethodFields;
}

export type SheetStateMembersUpdateQueue = {
	add: InventoryMemberFields[];
	remove: InventoryMemberFieldsDeleteAction[];
	update: InventoryMemberFields[];
};

export type UpdateSheetMetaDataAction = InventorySheetStateActionTemplate<
	"sheet_metadataUpdate",
	{
		members: SheetStateMembersUpdateQueue;
		name: string;
	}
>;

/**
 * An action that performs a partial update on a sheet
 * Used for backend database reducer
 */
export type InventorySheetPartialUpdateAction =
	| AddItemAction
	| RemoveItemAction
	| UpdateItemAction
	| UpdateSheetMetaDataAction;

/**
 * Action that can be executed to mutate frontend state
 * of a sheet.
 */
export type InventorySheetStateAction =
	| InventorySheetPartialUpdateAction
	| UpdateSheetAction;

/**
 * @typedef {object} InventorySheetState Holds the local state of an inventory sheet
 * @augments InventorySheetFields Extends the base inventory sheet, adding extra
 * information related to the state of the application.
 * @property {object} blockRefetch Information about how to block refetching
 * @property {number} blockRefetch.for The number of milliseconds to block
 * refetching
 * @property {Date} blockRefetch.from The timestamp from which to start blocking
 * refetching
 */
interface InventorySheetState extends InventorySheetFields {
	blockRefetch?: {
		for: number;
		from: Date;
	};
}

export default InventorySheetState;
