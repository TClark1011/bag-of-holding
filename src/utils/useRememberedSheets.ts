import { fetchRememberedSheets } from "./rememberSheets";
import { useEffect, useState } from "react";
import { InventorySheetMenuItemFields } from "../types/InventorySheetFields";

/**
 * Fetch the remembered sheets.
 * The 'fetchRememberedSheets()' function cannot be used in a component
 * normally due to NextJS executing some component code on the server,
 * and since 'fetchRememberedSheets()' uses localStorage, that causes
 * it to crash. So we use 'useEffect' and 'useState' to make sure
 * the function is only activated once the component is rendered in
 * the frontend.
 *
 * @returns All the remembered sheets
 */
const useRememberedSheets = (): InventorySheetMenuItemFields[] => {
	const [rememberedSheets, setRememberedSheets] = useState<
		InventorySheetMenuItemFields[]
	>([]);

	useEffect(() => {
		setRememberedSheets(fetchRememberedSheets());
	}, []);

	return rememberedSheets;
};

export default useRememberedSheets;
