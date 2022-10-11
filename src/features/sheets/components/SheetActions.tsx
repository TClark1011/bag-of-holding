import { useSheetPageState } from "$sheets/store";
import { Button, Input, SimpleGrid, Stack } from "@chakra-ui/react";
import { FC } from "react";

/**
 *
 */
const SheetActions: FC = () => {
	const {
		openDialog,
		searchbarValue,
		searchbarOnChange,
		resetFilters,
	} = useSheetPageState();

	return (
		<Stack
			minHeight={16}
			padding="group"
			direction={["column-reverse", "column-reverse", "row"]}
		>
			<Button
				data-testid="add-item-button"
				colorScheme="primary"
				onClick={() => openDialog("item.new")}
				flexGrow={0}
			>
				Add New Item
			</Button>
			{/* Search Bar */}
			<Input
				flexGrow={1}
				width="full"
				placeholder="Search"
				onChange={searchbarOnChange}
				value={searchbarValue}
			/>
			{/* NOTE: Updates may stutter in dev mode but is fine when built */}
			<SimpleGrid columns={[2, 2, 2, 1]} gap="group">
				{/* Reset Filters Button */}
				<Button onClick={resetFilters}>Reset Filters</Button>
				{/* Filter Options Dialog Button */}
				<Button
					width="full"
					display={["inline-flex", "inline-flex", "inline-flex", "none"]}
					onClick={() => openDialog("filter")}
					flexGrow={0}
				>
					Filters
				</Button>
			</SimpleGrid>
		</Stack>
	);
};

export default SheetActions;
