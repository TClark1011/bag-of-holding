import { fetchRememberedSheets } from "$sheets/utils";
import { useState } from "react";
import { InventorySheetMenuItemFields } from "$sheets/types";
import { useOnMountEffect } from "$root/hooks";

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
	>([]); //init as empty because `fetchRememberedSheets` does not work on server

	useOnMountEffect(() => {
		setRememberedSheets(fetchRememberedSheets());
		// Update with correct values once we are on the client
	});

	return rememberedSheets;
};

export default useRememberedSheets;
