import { sheetChannelName } from "$root/config/pusher/common";
import queries from "$root/hooks/queries";
import usePusherSubscription from "$root/hooks/usePusherSubscription";
import {
	useInventoryStore,
	useInventoryStoreDispatch,
	useLastInventoryStoreAction,
} from "$sheets/store";
import { useEffect } from "react";
import { match } from "ts-pattern";

/**
 * This hook will keep the client state in sync with
 * the server state by sending client state updates
 * to the server and server updates to the client.
 *
 *
 */
const useSheetServerSync = () => {
	const createItemMutation = queries.item.create.useMutation();
	const removeItemMutation = queries.item.delete.useMutation();
	const updateItemMutation = queries.item.update.useMutation();
	const setSheetNameMutation = queries.sheet.setName.useMutation();

	const sheetId = useInventoryStore((s) => s.sheet.id);
	const dispatch = useInventoryStoreDispatch();

	useEffect(() => {
		// Send client updates to the server
		const unsubscribe = useLastInventoryStoreAction.subscribe(
			({ lastAction }) => {
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
					.run();
			}
		);

		return unsubscribe;
	}, [createItemMutation, sheetId]);

	usePusherSubscription(sheetChannelName(sheetId), dispatch);
};

export default useSheetServerSync;
