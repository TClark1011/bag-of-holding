import queries from "$root/hooks/queries";
import { useInventoryStoreDispatch } from "$sheets/store";

/**
 * This file contains hooks that wrap the trpc mutations
 * and automatically sync the results with the client
 * state to keep the UI up to date
 */

export const useAddItemMutation: typeof queries.item.create.useMutation = (
	options
) => {
	const dispatch = useInventoryStoreDispatch();
	const mutation = queries.item.create.useMutation({
		...options,
		onSuccess: (result, ...remainingParams) => {
			dispatch({
				type: "add-item",
				payload: result,
			});

			return options?.onSuccess?.(result, ...remainingParams);
		},
	});

	return mutation;
};

export const useEditItemMutation: typeof queries.item.update.useMutation = (
	options
) => {
	const dispatch = useInventoryStoreDispatch();
	const mutation = queries.item.update.useMutation({
		...options,
		onSuccess: (result, ...remainingParams) => {
			dispatch({
				type: "update-item",
				payload: {
					data: result,
					itemId: result.id,
				},
			});

			return options?.onSuccess?.(result, ...remainingParams);
		},
	});

	return mutation;
};

export const useItemDeleteMutation: typeof queries.item.delete.useMutation = (
	options
) => {
	const dispatch = useInventoryStoreDispatch();
	const mutation = queries.item.delete.useMutation({
		...options,
		onSuccess: (result, input, context) => {
			dispatch({
				type: "remove-item",
				payload: input,
			});

			return options?.onSuccess?.(result, input, context);
		},
	});

	return mutation;
};

export const useCharacterCreateMutation: typeof queries.character.create.useMutation =
	(options) => {
		const dispatch = useInventoryStoreDispatch();
		const mutation = queries.character.create.useMutation({
			...options,
			onSuccess: (result, ...remainingParams) => {
				dispatch({
					type: "add-character",
					payload: result,
				});

				return options?.onSuccess?.(result, ...remainingParams);
			},
		});

		return mutation;
	};

export const useCharacterDeleteMutation: typeof queries.character.delete.useMutation =
	(options) => {
		const dispatch = useInventoryStoreDispatch();
		const mutation = queries.character.delete.useMutation({
			...options,
			onSuccess: (result, input, context) => {
				dispatch({
					type: "remove-character",
					payload: input,
				});

				return options?.onSuccess?.(result, input, context);
			},
		});

		return mutation;
	};

export const useCharacterUpdateMutation: typeof queries.character.update.useMutation =
	(options) => {
		const dispatch = useInventoryStoreDispatch();
		const mutation = queries.character.update.useMutation({
			...options,
			onSuccess: (result, ...remainingParams) => {
				dispatch({
					type: "update-character",
					payload: {
						data: result,
						characterId: result.id,
					},
				});

				return options?.onSuccess?.(result, ...remainingParams);
			},
		});

		return mutation;
	};

export const useSheetNameChangeMutation: typeof queries.sheet.setName.useMutation =
	(options) => {
		const dispatch = useInventoryStoreDispatch();
		const mutation = queries.sheet.setName.useMutation({
			...options,
			onSuccess: (result, ...remainingParams) => {
				dispatch({
					type: "set-sheet-name",
					payload: result.name,
				});

				return options?.onSuccess?.(result, ...remainingParams);
			},
		});

		return mutation;
	};

export const useMoneyUpdateMutation: typeof queries.sheet.updateMoney.useMutation =
	(options) => {
		const dispatch = useInventoryStoreDispatch();
		const mutation = queries.sheet.updateMoney.useMutation({
			...options,
			onSuccess: (result, ...remainingParams) => {
				dispatch({
					type: "money-change",
					payload: result,
				});

				return options?.onSuccess?.(result, ...remainingParams);
			},
		});

		return mutation;
	};
