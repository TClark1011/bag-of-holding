import { createContext, Dispatch, useContext } from "react";
import InventorySheetState, {
	InventorySheetStateAction,
} from "../../types/InventorySheetState";

interface SheetStateContextData {
	state: InventorySheetState;
	dispatch: Dispatch<InventorySheetStateAction>;
}

const SheetStateContext = createContext<SheetStateContextData>(
	{} as SheetStateContextData
);

/**
 * Hook to fetch the dispatcher for inventory state
 * actions.
 *
 * @returns {Function} inventory state action dispatcher
 */
export const useInventoryStateDispatch = (): Dispatch<InventorySheetStateAction> =>
	useContext(SheetStateContext).dispatch;

/**
 * Hook to fetch inventory state
 *
 * @returns {InventorySheetState} The state of the inventory
 */
export const useInventoryState = (): InventorySheetState =>
	useContext(SheetStateContext).state;

/**
 * The provider for inventory state
 *
 * @param {object} props The provider props
 * @param {InventorySheetState} props.state The state
 * of the inventory
 * @param {Function} props.dispatch The dispatch function
 * @returns {React.ReactElement} Component stuff
 */
const InventoryStateProvider: React.FC<SheetStateContextData> = ({
	state,
	dispatch,
	...props
}) => <SheetStateContext.Provider value={{ state, dispatch }} {...props} />;

export default InventoryStateProvider;
