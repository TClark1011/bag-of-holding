import { fetchRememberedSheets } from "./rememberSheets";
import { useEffect, useState } from "react";
import { InventorySheetMenuItemFields } from "./../types/InventorySheetFields";

/**
 *
 */
const useRememberedSheets = () => {
	const [rememberedSheets, setRememberedSheets] = useState<
		InventorySheetMenuItemFields[]
	>([]);

	useEffect(() => {
		setRememberedSheets(fetchRememberedSheets());
	}, []);

	return rememberedSheets;
};

export default useRememberedSheets;
