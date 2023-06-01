import { expectParam } from "$fp";
import queries from "$root/hooks/queries";
import {
	useAddItemMutation,
	useEditItemMutation,
	useItemDeleteMutation,
} from "$sheets/hooks";
import {
	fromSheet,
	useInventoryStore,
	useInventoryStoreDispatch,
} from "$sheets/store";
import { D, flow } from "@mobily/ts-belt";
import { Sheet } from "@prisma/client";
import { isAfter } from "date-fns/fp";
import { useCallback } from "react";

const useSheetUpdateIsNewerChecker = () => {
	const localUpdatedAt = useInventoryStore(fromSheet((s) => s.updatedAt));

	return useCallback(
		flow(
			expectParam<Sheet>(),
			D.getUnsafe("updatedAt"),
			isAfter(localUpdatedAt)
		),
		[localUpdatedAt]
	);
};

/**
 * Keep refetching the sheet, load fetched data into
 * local state if it is newer. Refetching is disabled
 * while a mutation is in progress
 */
const InventoryDataFetchingEffects = () => {
	const dispatch = useInventoryStoreDispatch();

	const createItemMutation = useAddItemMutation();
	const removeItemMutation = useItemDeleteMutation();
	const updateItemMutation = useEditItemMutation();
	const setSheetNameMutation = queries.sheet.setName.useMutation();
	const addCharacterMutation = queries.character.create.useMutation();
	const deleteCharacterMutation = queries.character.delete.useMutation();
	const updateCharacterMutation = queries.character.update.useMutation();

	const sheetId = useInventoryStore(fromSheet((s) => s.id));
	const deriveIfSheetUpdateIsNewer = useSheetUpdateIsNewerChecker();

	// Constantly refetch the sheet
	queries.sheet.getFull.useQuery(sheetId, {
		onSuccess: (data) => {
			if (data && deriveIfSheetUpdateIsNewer(data)) {
				// Update state if the sheet has changed
				dispatch({
					type: "set-sheet",
					payload: data,
				});
			}
		},
		enabled: ![
			createItemMutation,
			removeItemMutation,
			updateItemMutation,
			setSheetNameMutation,
			addCharacterMutation,
			deleteCharacterMutation,
			updateCharacterMutation,
		].some((mutation) => mutation.isLoading), //do not refetch while mutations are in progress
		refetchInterval: 1000 * 6,
		refetchIntervalInBackground: true,
	});

	return null;
};

export default InventoryDataFetchingEffects;
