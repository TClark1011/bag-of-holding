import { REFETCH_INTERVAL } from "$root/config";
import { fetchSheet } from "$sheets/api";
import { useSheetPageId } from "$sheets/hooks";
import { FullSheet } from "$sheets/types";
import { useInterval } from "@chakra-ui/react";
import { Sheet } from "@prisma/client";

/**
 * Run an effect whenever sheet data is re-fetched
 *
 * @param effect The function effect to run, is
 * passed the re-fetched data that triggered the
 * effect to run.
 */
const useSheetRefetchEffect = (effect: (p: FullSheet) => void) => {
	const id = useSheetPageId();

	useInterval(() => {
		fetchSheet(id).then(({ data }) => {
			effect(data);
		});
	}, REFETCH_INTERVAL);
};

export default useSheetRefetchEffect;
