import { InventoryItemCreationFields } from "./InventoryItemFields";
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
interface InventorySheetStateActionTemplate<T extends string, D> {
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
type AddItemAction = InventorySheetStateActionTemplate<
	"item_add",
	InventoryItemCreationFields
>;

/**
 * Action for removing an item from sheet inventory
 */
type RemoveItemAction = InventorySheetStateActionTemplate<
	"item_remove",
	string
>;
/**
 * Action for setting whether or not sheet state is ahead of server state
 */
type UpdateItemAction = InventorySheetStateActionTemplate<
	"item_update",
	InventoryItemCreationFields
>;

/**
 * Action for completely updating a sheet's state
 */
type UpdateSheetAction = InventorySheetStateActionTemplate<
	"sheet_update",
	Partial<InventorySheetFields>
>;

/**
 * Action for setting whether or not sheet state is ahead of server state
 */
type SetStateIsAheadAction = InventorySheetStateActionTemplate<
	"sheet_setIsAhead",
	boolean
>;

/**
 * Type for all valid actions
 */
export type InventorySheetStateAction =
	| AddItemAction
	| RemoveItemAction
	| UpdateSheetAction
	| SetStateIsAheadAction
	| UpdateItemAction;

/**
 * @typedef {object} InventorySheetState Holds the local state of an inventory sheet
 * @augments InventorySheetFields Extends the base inventory sheet, adding extra
 * information related to the state of the application.
 * @property {boolean} [isAhead] Whether or not the state is ahead of the server
 * state. If this equals true, data returned from the regular refetching will not
 * be applied.
 * @property {boolean} [isLoading] Whether or not the sheet is currently in a 'loading'
 * state. If true, the sheet will be covered with a loading overlay, blocking input
 * until this property is switched back to false.
 */
interface InventorySheetState extends InventorySheetFields {
	isAhead?: boolean;
	isLoading?: boolean;
}

export default InventorySheetState;
