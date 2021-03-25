import { Button, IconButton } from "@chakra-ui/button";
import { useInterval } from "@chakra-ui/hooks";
import {
	Box,
	Flex,
	Heading,
	HStack,
	SimpleGrid,
	Stack,
} from "@chakra-ui/layout";
import { Tag } from "@chakra-ui/tag";
import Head from "next/head";
import { Reducer, useReducer } from "react";
import ItemDialog from "../components/domain/ItemDialog";
import InventoryTableSheet from "../components/domain/InventorySheetTable";
import InventorySheetFields from "../types/InventorySheetFields";
import InventorySheetState, {
	InventorySheetStateAction,
} from "../types/InventorySheetState";
import inventorySheetStateReducer from "../reducers/inventoryReducer";
import getUrlParam from "../utils/getUrlParam";
import SheetStateProvider from "../components/contexts/InventoryStateContext";
import { fetchSheet } from "../db/sheetServices";
import { REFETCH_INTERVAL } from "../config/publicEnv";
import { GetServerSideProps } from "next";
import SheetDialog from "../components/domain/SheetDialog";
import { CreateOutlineIcon } from "chakra-ui-ionicons";
import MemberCarryWeightTable from "../components/domain/MemberCarryWeightTable";
import ColorModeSwitch from "../components/domain/ColorModeSwitch";
import { Input } from "@chakra-ui/input";
import deepEqual from "deep-equal";
import { appName } from "../constants/branding";
import sheetPageReducer, {
	emptyFilters,
	selectDialogIsOpen,
	SheetPageState,
	SheetPageStateAction,
} from "../reducers/sheetPageReducer";

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
	const [
		{ items, name, members, _id, isAhead },
		inventoryDispatch,
	] = useReducer<Reducer<InventorySheetState, InventorySheetStateAction>>(
		inventorySheetStateReducer,
		{
			...sheetFields,
			isAhead: false,
		}
	);

	const [sheetState, sheetDispatch] = useReducer<
		Reducer<SheetPageState, SheetPageStateAction>
	>(sheetPageReducer, {
		dialog: {
			type: "item.new",
			isOpen: false,
			activeItem: items[0],
		},
		filters:emptyFilters
	});

	/**
	 * Close dialog message
	 */
	const dialogOnClose = () => {
		sheetDispatch({ type: "dialog_close" });
	};

	//TODO: Switch back to manual fetches
	useInterval(() => {
		if (isAhead) {
			//? If local state is ahead of server, we ignore the next refetch give the server time to update
			inventoryDispatch({ type: "sheet_setIsAhead", data: false });
		} else {
			//? We refresh the props from the server every 3 seconds
			// router.replace(router.asPath, "", { scroll: false });
			fetch("/api/" + sheetFields._id)
				.then((res) => res.json())
				.then((data) => {
					if (!deepEqual({ items, name, members, _id, isAhead }, data))
						inventoryDispatch({ type: "sheet_update", data });
				});
		}
	}, REFETCH_INTERVAL);

	return (
		<SheetStateProvider
			dispatch={inventoryDispatch}
			state={{ items, members, name, _id }}
		>
			<Box>
				<Head>
					<title>
						{appName} - {name}
					</title>
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<main>
					{/* Top Bar */}
					<Box padding={2} backgroundColor="primary.600" color="white">
						<Flex justify="space-between">
							<Flex>
								{/* Sheet Title */}
								<Heading paddingBottom="group" marginRight={1}>
									{name}
								</Heading>
								<IconButton
									aria-label="edit sheet settings"
									icon={<CreateOutlineIcon boxSize={6} />}
									onClick={() =>
										sheetDispatch({ type: "dialog_open", data: "sheetOptions" })
									}
									variant="ghost"
									isRound
								/>
							</Flex>
							<ColorModeSwitch variant="ghost" />
						</Flex>
						<HStack spacing="group">
							{/* Party Members Tags */}
							{members.map((item) => (
								<Tag key={item}>{item}</Tag>
							))}
						</HStack>
					</Box>

					{/* Include in search bar:
						- Reset filters button
						- Add new Item button
					*/}
					<Stack
						minHeight={16}
						columns={3}
						padding="group"
						direction={["column-reverse", "column-reverse", "row"]}
					>
						<Box>
							{/* Add new Item Button */}
							<Button
								colorScheme="secondary"
								onClick={() =>
									sheetDispatch({ type: "dialog_open", data: "item.new" })
								}
								width="full"
							>
								Add New Item
							</Button>
						</Box>
						<Box flexGrow={2}>
							{/* Search Bar */}
							<Input width="full" placeholder="Search" />
						</Box>
						<Box>
							{/* Reset Filters Button */}
							<SimpleGrid columns={[2, 2, 2, 1]} gap="group">
								<Button width="full">Reset Filters</Button>{" "}
								<Button
									width="full"
									display={[
										"inline-flex",
										"inline-flex",
										"inline-flex",
										"none",
									]}
								>
									Filter Options
								</Button>
							</SimpleGrid>
						</Box>
					</Stack>
					<InventoryTableSheet
						onRowClick={(item) =>
							sheetDispatch({
								type: "dialog_open",
								data: {
									type: "item.edit",
									item,
								},
							})
						}
						items={items}
						marginBottom="break"
					/>

					<Heading as="h2">Member Inventories</Heading>
					<MemberCarryWeightTable />

					{/* Dialogs */}
					<ItemDialog
						isOpen={selectDialogIsOpen(sheetState, "item.new")}
						onClose={dialogOnClose}
						mode={"new"}
						item={sheetState.dialog.activeItem}
					/>
					<ItemDialog
						isOpen={selectDialogIsOpen(sheetState, "item.edit")}
						onClose={dialogOnClose}
						mode={"edit"}
						item={sheetState.dialog.activeItem}
					/>
					<SheetDialog
						isOpen={selectDialogIsOpen(sheetState, "sheetOptions")}
						onClose={dialogOnClose}
					/>
				</main>
			</Box>
		</SheetStateProvider>
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
	return {
		props: await fetchSheet(getUrlParam(context.params.sheetId)),
	};
};

export default Sheet;
