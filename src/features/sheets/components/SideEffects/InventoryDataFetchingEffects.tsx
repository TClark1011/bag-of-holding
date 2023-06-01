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
	useLastInventoryStoreAction,
} from "$sheets/store";
import { useStoreEffect } from "$zustand";
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

	useStoreEffect(useLastInventoryStoreAction, ({ lastAction }) => {
		if (lastAction === null || lastAction.type === "set-sheet") return;

		switch (lastAction.type) {
			case "set-sheet-name":
				setSheetNameMutation.mutate(lastAction.resolvedPayload);
				break;
			case "add-character":
				addCharacterMutation.mutate(lastAction.resolvedPayload);
				break;
			case "remove-character":
				deleteCharacterMutation.mutate(lastAction.originalAction.payload);
				break;
			case "update-character":
				updateCharacterMutation.mutate(lastAction.originalAction.payload);
				break;
			default:
				break;
		}
	});

	return null;
};

export default InventoryDataFetchingEffects;
