import { useSetDisappearingHashAtom } from "$jotai-hash-disappear-atom";
import { CoinIcon } from "$root/components";
import useEffectWithTransition from "$root/hooks/useEffectWithTransition";
import useRenderLogging from "$root/hooks/useRenderLogging";
import addCommasToNumber from "$root/utils/addCommasToNumber";
import { useAllColumnsAreVisible } from "$sheets/hooks";
import {
	filterDialogIsOpenAtom,
	itemDialogAtom,
	moneyDialogIsOpenAtom,
	selectAnyFilteringIsBeingDone,
	selectFilteringIsAvailable,
	selectPartyMoney,
	useInventoryStore,
	useInventoryStoreDispatch,
} from "$sheets/store";
import { useEntityTiedDialogAtom } from "$sheets/utils";
import {
	Button,
	Flex,
	IconButton,
	Input,
	SimpleGrid,
	Stack,
} from "@chakra-ui/react";
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
	const setMoneyDialogIsOpen = useSetDisappearingHashAtom(
		moneyDialogIsOpenAtom
	);
	const { onOpenToCreateNewEntity: openNewItemDialog } =
		useEntityTiedDialogAtom(itemDialogAtom);

	const partyMoney = useInventoryStore(selectPartyMoney, []);
	const partyHasNoMoney = partyMoney === 0;

	return (
		<Stack
			minHeight={16}
			padding="group"
			direction={["column-reverse", "column-reverse", "row"]}
		>
			{!partyHasNoMoney && (
				<Button
					variant="outline"
					flexGrow={0}
					leftIcon={<CoinIcon />}
					onClick={() => setMoneyDialogIsOpen(true)}
					flexShrink={0}
				>
					{addCommasToNumber(partyMoney)}
				</Button>
			)}
			<Flex flexShrink={0}>
				{/* If someone isn't using the money functionality, the large
				    money display just showing "0" might get annoying, so if 
						the party has no money, we just show this little icon
						button instead. */}
				{partyHasNoMoney && (
					<IconButton
						onClick={() => setMoneyDialogIsOpen(true)}
						icon={<CoinIcon />}
						variant="outline"
						aria-label="manage money"
						mr="group"
					/>
				)}
				<Button
					data-testid="add-item-button"
					onClick={openNewItemDialog}
					colorScheme="primary"
					flexGrow={1}
				>
					Add New Item
				</Button>
			</Flex>

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
