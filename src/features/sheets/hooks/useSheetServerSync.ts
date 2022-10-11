import { expectParam } from "$fp";
import queries from "$root/hooks/queries";
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
import { match } from "ts-pattern";

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
 * client state in sync with the server state
 */
const useSheetServerSync = () => {
	const dispatch = useInventoryStoreDispatch();

	const createItemMutation = queries.item.create.useMutation();
	const removeItemMutation = queries.item.delete.useMutation();
	const updateItemMutation = queries.item.update.useMutation();
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
		].some(D.getUnsafe("isLoading")), //do not refetch while mutations are in progress
		refetchInterval: 1000 * 6,
		refetchIntervalInBackground: true,
	});

	useStoreEffect(useLastInventoryStoreAction, ({ lastAction }) => {
		if (lastAction === null || lastAction.type === "set-sheet") return;
		match(lastAction)
			.with(
				{
					type: "add-item",
				},
				(action) => createItemMutation.mutate(action)
			)
			.with({ type: "remove-item" }, (action) =>
				removeItemMutation.mutate(action.originalAction)
			)
			.with(
				{
					type: "update-item",
				},
				(action) => updateItemMutation.mutate(action.originalAction)
			)
			.with({ type: "set-sheet-name" }, (action) =>
				setSheetNameMutation.mutate(action)
			)
			.with({ type: "add-character" }, (action) =>
				addCharacterMutation.mutate(action)
			)
			.with({ type: "remove-character" }, (action) =>
				deleteCharacterMutation.mutate(action.originalAction)
			)
			.with({ type: "update-character" }, (action) =>
				updateCharacterMutation.mutate(action.originalAction)
			)
			.otherwise(() => {});
	});
};

export default useSheetServerSync;
