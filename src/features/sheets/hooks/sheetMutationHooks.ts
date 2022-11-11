/* eslint-disable jsdoc/require-jsdoc */
import queries from "$root/hooks/queries";
import { useInventoryStoreDispatch } from "$sheets/store";

export const useAddItemMutation: typeof queries.item.create.useMutation = (
	options
) => {
	const dispatch = useInventoryStoreDispatch();
	const mutation = queries.item.create.useMutation({
		...options,
		onMutate: (input) => {
			dispatch({
				type: "add-item",
				payload: input as any,
			});

			return options?.onMutate?.(input);
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
		onMutate: (input) => {
			dispatch({
				type: "update-item",
				payload: input as any,
			});

			return options?.onMutate?.(input);
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
		onMutate: (input) => {
			dispatch({
				type: "remove-item",
				payload: input as any,
			});

			return options?.onMutate?.(input);
		},
	});

	return mutation;
};
