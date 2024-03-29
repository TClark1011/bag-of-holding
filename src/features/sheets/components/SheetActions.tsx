import { useSetDisappearingHashAtom } from "$jotai-hash-disappear-atom";
import useEffectWithTransition from "$root/hooks/useEffectWithTransition";
import useRenderLogging from "$root/hooks/useRenderLogging";
import { useAllColumnsAreVisible } from "$sheets/hooks";
import {
	filterDialogIsOpenAtom,
	itemDialogAtom,
	selectAnyFilteringIsBeingDone,
	selectFilteringIsAvailable,
	useInventoryStore,
	useInventoryStoreDispatch,
} from "$sheets/store";
import { useEntityTiedDialogAtom } from "$sheets/utils";
import { Button, Input, SimpleGrid, Stack } from "@chakra-ui/react";
import { FC, useState } from "react";

const useSearchInputProps = () => {
	const dispatch = useInventoryStoreDispatch();

	const [localValue, setLocalValue] = useState("");

	useEffectWithTransition(() => {
		dispatch({
			type: "ui.set-search-value",
			payload: localValue,
		});
	}, [dispatch, localValue]);

	/**
	 * We are using an approach where we track the value of the search
	 * bar via local `useState`, and then whenever that value changes,
	 * we insert the local tate into global state once the value has
	 * settled ("settled" = has been the same for 200ms). The reason for
	 * this is that if we simply used the global state value it would
	 * make the search bar very laggy, as everytime an input is performed,
	 * all the item searching calculations would be re-run.
	 */

	return {
		value: localValue,
		onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
			setLocalValue(e.target.value);
		},
	};
};

/**
 * Primary actions of a sheet
 * - Add New Item
 * - Search
 * - Filter Controls
 */
const SheetActions: FC = () => {
	useRenderLogging("SheetActions");

	const dispatch = useInventoryStoreDispatch();
	const searchInputProps = useSearchInputProps();
	const filteringIsAvailable = useInventoryStore(
		selectFilteringIsAvailable,
		[]
	);
	const anyFilteringIsApplied = useInventoryStore(
		selectAnyFilteringIsBeingDone,
		[]
	);

	const allColumnsAreVisible = useAllColumnsAreVisible();

	const setFilterDialogIsOpen = useSetDisappearingHashAtom(
		filterDialogIsOpenAtom
	);
	const { onOpenToCreateNewEntity: openNewItemDialog } =
		useEntityTiedDialogAtom(itemDialogAtom);

	return (
		<Stack
			minHeight={16}
			padding="group"
			direction={["column-reverse", "column-reverse", "row"]}
		>
			<Button
				data-testid="add-item-button"
				colorScheme="primary"
				onClick={openNewItemDialog}
				flexShrink={0}
			>
				Add New Item
			</Button>
			{/* Search Bar */}
			<Input
				flexGrow={1}
				width="full"
				placeholder="Search"
				{...searchInputProps}
			/>
			{/* NOTE: Updates may stutter in dev mode but is fine when built */}
			<SimpleGrid
				flexShrink={0}
				columns={allColumnsAreVisible ? 1 : 2}
				gap="group"
			>
				{/* Filter Options Dialog Button */}
				<Button
					width="full"
					hidden={allColumnsAreVisible}
					onClick={() => setFilterDialogIsOpen(true)}
					flexGrow={0}
					isDisabled={!filteringIsAvailable}
				>
					Filters
				</Button>

				{/* Reset Filters Button */}
				<Button
					isDisabled={!anyFilteringIsApplied}
					onClick={() =>
						dispatch({
							type: "ui.reset-all-filters",
						})
					}
				>
					Reset Filters
				</Button>
			</SimpleGrid>
		</Stack>
	);
};

export default SheetActions;
