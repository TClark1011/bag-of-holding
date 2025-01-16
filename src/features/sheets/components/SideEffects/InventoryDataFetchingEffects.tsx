import { SHEET_REFETCH_INTERVAL_MS } from "$root/config";
import queries from "$root/hooks/queries";
import {
	useAddItemMutation,
	useEditItemMutation,
	useItemDeleteMutation,
} from "$sheets/hooks";
import { useInventoryStore, useInventoryStoreDispatch } from "$sheets/store";
import { useMemo } from "react";

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

	const sheetUpdatedAt = useInventoryStore((s) => s.sheet.updatedAt, []);
	const sheetId = useInventoryStore((s) => s.sheet.id, []);

	const sheetMutationIsInProgress = useMemo(
		() =>
			[
				createItemMutation,
				removeItemMutation,
				updateItemMutation,
				setSheetNameMutation,
				addCharacterMutation,
				deleteCharacterMutation,
				updateCharacterMutation,
			].some((mutation) => mutation.isLoading),
		[
			createItemMutation,
			removeItemMutation,
			updateItemMutation,
			setSheetNameMutation,
			addCharacterMutation,
			deleteCharacterMutation,
			updateCharacterMutation,
		]
	);

	const { data: sheetIsOutOfDate = false } =
		queries.sheet.updateExists.useQuery(
			{
				sheetId,
				updatedAt: sheetUpdatedAt,
			},
			{
				refetchInterval: SHEET_REFETCH_INTERVAL_MS,
				enabled: !sheetMutationIsInProgress,
			}
		);

	// Refetch the sheet if it is out of date and send it
	// to state management
	queries.sheet.getFull.useQuery(sheetId, {
		onSuccess: (data) => {
			// Update state if the sheet has changed
			dispatch({
				type: "set-sheet",
				payload: data,
			});
		},
		enabled: sheetIsOutOfDate && !sheetMutationIsInProgress, //do not refetch while mutations are in progress
		refetchInterval: SHEET_REFETCH_INTERVAL_MS,
	});

	return null;
};

export default InventoryDataFetchingEffects;
