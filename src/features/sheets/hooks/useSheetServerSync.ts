import queries from "$root/hooks/queries";
import {
	fromSheet,
	useInventoryStore,
	useInventoryStoreDispatch,
	useLastInventoryStoreAction,
} from "$sheets/store";
import { useStoreEffect } from "$zustand";
import { D } from "@mobily/ts-belt";
import { useEffect } from "react";
import { match } from "ts-pattern";

/**
 * client state in sync with the server state
 */
const useSheetServerSync = () => {
	const createItemMutation = queries.item.create.useMutation();
	const removeItemMutation = queries.item.delete.useMutation();
	const updateItemMutation = queries.item.update.useMutation();
	const setSheetNameMutation = queries.sheet.setName.useMutation();
	const addCharacterMutation = queries.character.create.useMutation();
	const deleteCharacterMutation = queries.character.delete.useMutation();
	const updateCharacterMutation = queries.character.update.useMutation();

	const sheetId = useInventoryStore(fromSheet(D.getUnsafe("id")));
	const dispatch = useInventoryStoreDispatch();

	queries.sheet.getFull.useQuery(sheetId, {
		onSuccess: (data) => {
			if (!data) return;
			dispatch({
				type: "set-sheet",
				payload: data,
			});
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
				removeItemMutation.mutate(action)
			)
			.with(
				{
					type: "update-item",
				},
				(action) => updateItemMutation.mutate(action)
			)
			.with({ type: "set-sheet-name" }, ({ payload, actionId }) =>
				setSheetNameMutation.mutate({
					actionId: actionId,
					payload: {
						sheetId: sheetId,
						newName: payload,
					},
				})
			)
			.with({ type: "add-character" }, (action) =>
				addCharacterMutation.mutate(action)
			)
			.with({ type: "remove-character" }, (action) =>
				deleteCharacterMutation.mutate(action)
			)
			.with({ type: "update-character" }, (action) =>
				updateCharacterMutation.mutate(action)
			)
			.otherwise(() => {});
	});
};

export default useSheetServerSync;
