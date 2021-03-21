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
 *
 */
export const useSheetStateDispatch = (): Dispatch<InventorySheetStateAction> =>
	useContext(SheetStateContext).dispatch;

/**
 *
 */
export const useSheetState = (): InventorySheetState =>
	useContext(SheetStateContext).state;

/**
 * @param root0
 * @param root0.state
 * @param root0.dispatch
 */
const SheetStateProvider: React.FC<SheetStateContextData> = ({
	state,
	dispatch,
	...props
}) => <SheetStateContext.Provider value={{ state, dispatch }} {...props} />;

export default SheetStateProvider;
