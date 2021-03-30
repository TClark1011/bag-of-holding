import { Button, IconButton } from "@chakra-ui/button";
import { useInterval } from "@chakra-ui/hooks";
import {
	Box,
	Center,
	Divider,
	Flex,
	Heading,
	SimpleGrid,
	Stack,
} from "@chakra-ui/layout";
import { Reducer, useEffect, useReducer } from "react";
import ItemDialog from "../components/domain/ItemDialog";
import InventorySheetFields from "../types/InventorySheetFields";
import InventorySheetState, {
	InventorySheetStateAction,
} from "../types/InventorySheetState";
import getUrlParam from "../utils/getUrlParam";
import SheetStateProvider from "../components/contexts/InventoryStateContext";
import { fetchSheet } from "../db/sheetServices";
import { REFETCH_INTERVAL } from "../config/publicEnv";
import { GetServerSideProps } from "next";
import SheetOptionsDialog from "../components/domain/SheetOptionsDialog";
import { CreateOutlineIcon } from "chakra-ui-ionicons";
import MemberCarryWeightTable from "../components/domain/MemberCarryWeightTable";
import ColorModeSwitch from "../components/ui/ColorModeSwitch";
import { Input } from "@chakra-ui/input";
import deepEqual from "deep-equal";
import { appDomain, appName } from "../constants/meta";
import FilterDialog from "../components/domain/SheetPage/Dialogs/FilterDialog";
import { useSheetPageState } from "../state/sheetPageState";
import InventorySheetTable from "../components/domain/InventorySheetTable";
import { addToRememberedSheets } from "../utils/rememberSheets";
import inventoryReducer from "../state/inventoryReducer";
import { LightMode } from "@chakra-ui/color-mode";
import PartyMemberTagList from "../components/templates/PartyMemberTagList";
import Meta from "../components/templates/Meta";

/**
 * The page for a specific sheet
 *
 * @param {InventorySheetFields} sheetFields The component sheetFields
 * @param {string} sheetFields.name The name of the sheet
 * @param {InventoryItemFields[]} sheetFields.items The items in the sheet
 * @param {string[]} sheetFields.members Members
 * @returns {React.ReactElement} Sheet component
 */
const Sheet: React.FC<InventorySheetFields> = (sheetFields) => {
	const [{ items, name, members, _id }, inventoryDispatch] = useReducer<
		Reducer<InventorySheetState, InventorySheetStateAction>
	>(inventoryReducer, {
		...sheetFields,
		blockRefetch: {
			for: 0,
			from: new Date(),
		},
	});

	useEffect(() => {
		addToRememberedSheets({ _id, name, members });
		//? Store the sheet to the list of 'remembered' sheets
	}, [_id, name, members]);

	const {
		openDialog,
		searchbarValue,
		searchbarOnChange,
		resetFilters,
	} = useSheetPageState();

	/**
	 * Refetch the data regularly
	 */
	useInterval(() => {
		fetch("/api/" + sheetFields._id)
			.then((res) => res.json())
			.then((data) => {
				if (
					!deepEqual(items, data.items) ||
					!deepEqual(name, data.name) ||
					!deepEqual(members, data.members)
				)
					inventoryDispatch({ type: "sheet_update", data });
			});
	}, REFETCH_INTERVAL);

	return (
		<>
			<Meta
				title={appName + " - " + name}
				url={appDomain + "/" + sheetFields._id}
			/>
			<SheetStateProvider
				dispatch={inventoryDispatch}
				state={{ items, members, name, _id }}
			>
				<Box>
					<main>
						{/* Top Bar */}
						<Box
							padding={2}
							backgroundColor="gray.900"
							color="gray.50"
							boxShadow="lg"
						>
							<Flex justify="space-between">
								<Flex>
									{/* Sheet Title */}
									<Heading paddingBottom="md" marginRight={1}>
										{name}
									</Heading>
									<IconButton
										aria-label="edit sheet settings"
										icon={<CreateOutlineIcon boxSize={6} />}
										onClick={() => openDialog("sheetOptions")}
										variant="ghost"
										isRound
									/>
								</Flex>
								<ColorModeSwitch variant="ghost" />
							</Flex>
							<LightMode>
								<PartyMemberTagList members={members} />
							</LightMode>
						</Box>
						<Stack
							minHeight={16}
							columns={3}
							padding="group"
							direction={["column-reverse", "column-reverse", "row"]}
						>
							<Box>
								{/* Add new Item Button */}
								<Button
									colorScheme="primary"
									onClick={() => openDialog("item.new")}
									width="full"
								>
									Add New Item
								</Button>
							</Box>
							<Box flexGrow={2}>
								{/* Search Bar */}
								<Input
									width="full"
									placeholder="Search"
									onChange={searchbarOnChange}
									value={searchbarValue}
								/>
								{/* NOTE: Updates may stutter in dev mode but is fine when built */}
							</Box>
							<Box>
								<SimpleGrid columns={[2, 2, 2, 1]} gap="group">
									{/* Reset Filters Button */}
									<Button width="full" onClick={resetFilters}>
										Reset Filters
									</Button>
									{/* Filter Options Dialog Button */}
									<Button
										width="full"
										display={[
											"inline-flex",
											"inline-flex",
											"inline-flex",
											"none",
										]}
										onClick={() => openDialog("filter")}
									>
										Filters
									</Button>
								</SimpleGrid>
							</Box>
						</Stack>
						<InventorySheetTable
							onRowClick={(item) => openDialog("item.edit", item)}
							marginBottom="break"
						/>
						<Flex width="full">
							<Center flexGrow={1}>
								<Divider />
							</Center>
							<Heading
								as="h3"
								textStyle="h3"
								fontWeight="300"
								flexShrink={1}
								textAlign="center"
								display="inline"
								paddingX="break"
							>
								Party Member Totals
							</Heading>
							<Center flexGrow={1}>
								<Divider />
							</Center>
						</Flex>
						<MemberCarryWeightTable />
						{/* Dialogs */}
						<ItemDialog mode="new" />
						<ItemDialog mode="edit" />
						<FilterDialog />
						<SheetOptionsDialog />
					</main>
				</Box>
			</SheetStateProvider>
		</>
	);
};

/**
 * Get the props rendered by the server
 *
 * @param {object} context Path context data
 * @param {object} context.params Path url parameters
 * @param {string | string[]} context.params.sheetId The sheet id in the ur;
 * @returns {GetStaticPropsResult<InventorySheetFields>} The props for the sheet
 */
export const getServerSideProps: GetServerSideProps<InventorySheetFields> = async (
	context
) => {
	const sheetData = await fetchSheet(getUrlParam(context.params.sheetId));
	return {
		props: sheetData,
	};
};

export default Sheet;
