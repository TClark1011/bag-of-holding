import { InventoryItemCreationFields } from "./InventoryItemFields";
import InventorySheetFields from "./InventorySheetFields";

interface InventorySheetStateActionTemplate<T extends string, D> {
	readonly type: T;
	readonly data: D;
	readonly sendToServer?: boolean;
	readonly onFinally?: () => void;
	readonly onCatch?: (err?: Error) => void;
	readonly onThen?: () => void;
}

type AddItemAction = InventorySheetStateActionTemplate<
	"item_add",
	InventoryItemCreationFields
>;
type RemoveItemAction = InventorySheetStateActionTemplate<
	"item_remove",
	string
>;
type UpdateSheetAction = InventorySheetStateActionTemplate<
	"sheet_update",
	InventorySheetFields
>;

export type InventorySheetStateAction =
	| AddItemAction
	| RemoveItemAction
	| UpdateSheetAction;

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
