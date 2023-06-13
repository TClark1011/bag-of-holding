import { useDisappearingHashBooleanAtom } from "$jotai-history-toggle";
import { SEARCH_BAR_DELAY_MS } from "$root/config";
import { useDebouncedEffect } from "$root/hooks/debounceHooks";
import useRenderLogging from "$root/hooks/useRenderLogging";
import { useAllColumnsAreVisible } from "$sheets/hooks";
import {
	filterDialogIsOpenAtom,
	selectAnyFilteringIsBeingDone,
	selectFilteringIsAvailable,
	useInventoryStore,
	useInventoryStoreDispatch,
} from "$sheets/store";
import { Button, Input, SimpleGrid, Stack } from "@chakra-ui/react";
import { FC, useState } from "react";

const useSearchInputProps = () => {
	const dispatch = useInventoryStoreDispatch();

	const [localValue, setLocalValue] = useState("");

	useDebouncedEffect(
		() => {
			dispatch({
				type: "ui.set-search-value",
				payload: localValue,
			});
		},
		[localValue],
		SEARCH_BAR_DELAY_MS
	);

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

	const { set: setFilterDialogIsOpen } = useDisappearingHashBooleanAtom(
		filterDialogIsOpenAtom
	);

	return (
		<Stack
			minHeight={16}
			padding="group"
			direction={["column-reverse", "column-reverse", "row"]}
		>
			<Button
				data-testid="add-item-button"
				colorScheme="primary"
				onClick={() =>
					dispatch({
						type: "ui.open-new-item-dialog",
					})
				}
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
