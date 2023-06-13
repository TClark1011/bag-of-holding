import { inventoryAtom } from "$sheets/store";
import { useAtomDevtools } from "jotai-devtools";
import { FC } from "react";

const SheetDevTools: FC = () => {
	useAtomDevtools(inventoryAtom as any, {
		name: "inventory",
		enabled: typeof window !== "undefined",
	});

	return null;
};

export default SheetDevTools;
