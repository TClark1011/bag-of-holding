import { get } from "$fp";
import { useInventoryStore, useRememberedSheetsDispatch } from "$sheets/store";
import { D, flow } from "@mobily/ts-belt";
import { useEffect } from "react";

const useRememberSheetEffect = () => {
	const dispatch = useRememberedSheetsDispatch();
	const { id: sheetId, name: sheetName } = useInventoryStore(
		flow(get("sheet"), D.selectKeys(["id", "name"])),
		[]
	);

	useEffect(() => {
		if (sheetId !== "") {
			dispatch({
				type: "rememberSheet",
				payload: {
					id: sheetId,
					name: sheetName,
					visitedAt: new Date(),
				},
			});
		}
	}, [sheetId, sheetName, dispatch]);
};

export default useRememberSheetEffect;
