import { SheetState, SheetStateAction } from "$sheets/types";
import { createContext, Dispatch, useContext } from "react";

interface SheetStateContextData {
	state: SheetState;
	dispatch: Dispatch<SheetStateAction>;
}

const SheetStateContext = createContext<SheetStateContextData>(
	{} as SheetStateContextData
);

/**
 * Hook to fetch the dispatcher for inventory state
 * actions.
 *
 * @returns inventory state action dispatcher
 */
export const useInventoryStateDispatch = (): Dispatch<SheetStateAction> =>
	useContext(SheetStateContext).dispatch;

/**
 * Hook to fetch inventory state
 *
 * @returns The state of the inventory
 */
export const useInventoryState = (): SheetState =>
	useContext(SheetStateContext).state;

/**
 * The provider for inventory state
 *
 * @param props The provider props
 * @param props.state The state
 * of the inventory
 * @param props.dispatch The dispatch function
 * @returns Component stuff
 */
const InventoryStateProvider: React.FC<SheetStateContextData> = ({
	state,
	dispatch,
	...props
}) => <SheetStateContext.Provider value={{ state, dispatch }} {...props} />;

export default InventoryStateProvider;
