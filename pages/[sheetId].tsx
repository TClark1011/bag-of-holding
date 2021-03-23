import { Button, IconButton } from "@chakra-ui/button";
import { useDisclosure, useInterval } from "@chakra-ui/hooks";
import { Box, Flex, Heading, HStack } from "@chakra-ui/layout";
import { Tag } from "@chakra-ui/tag";
import Head from "next/head";
import { Reducer, useEffect, useReducer, useState } from "react";
import ItemDialog, { ItemDialogMode } from "../components/domain/ItemDialog";
import InventoryTableSheet from "../components/domain/InventorySheetTable";
import InventorySheetFields from "../types/InventorySheetFields";
import InventorySheetState, {
	InventorySheetStateAction,
} from "../types/InventorySheetState";
import inventorySheetStateReducer from "../utils/inventorySheetStateReducer";
import getUrlParam from "../utils/getUrlParam";
import SheetStateProvider from "../components/contexts/SheetStateContext";
import { fetchSheet } from "../db/sheetServices";
import { useRouter } from "next/router";
import InventoryItemFields from "../types/InventoryItemFields";
import { REFETCH_INTERVAL } from "../config/publicEnv";
import { GetServerSideProps } from "next";
import SheetDialog from "../components/domain/SheetDialog";
import { SettingsOutlineIcon, CreateOutlineIcon } from "chakra-ui-ionicons";
import MemberCarryWeightTable from "../components/domain/MemberCarryWeightTable";
import ColorModeSwitch from "../components/domain/ColorModeSwitch";

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
	const [{ items, name, members, _id, isAhead }, dispatch] = useReducer<
		Reducer<InventorySheetState, InventorySheetStateAction>
	>(inventorySheetStateReducer, {
		...sheetFields,
		isAhead: false,
	});

	useEffect(() => {
		dispatch({ type: "sheet_update", data: { ...sheetFields } });
		//? When the sheet's props are updated via refetching, load the new values into state
	}, [sheetFields]);

	const router = useRouter();

	//TODO: Switch back to manual fetches
	useInterval(() => {
		if (isAhead) {
			//? If local state is ahead of server, we ignore the next refetch give the server time to update
			dispatch({ type: "sheet_setIsAhead", data: false });
		} else {
			//? We refresh the props from the server every 3 seconds
			router.replace(router.asPath, "", { scroll: false });
		}
	}, REFETCH_INTERVAL);

	const newItemDialogController = useDisclosure();

	const [itemDialogMode, setItemDialogMode] = useState<ItemDialogMode>("edit");
	const [activeItem, setActiveItem] = useState<InventoryItemFields>(items[0]);

	const sheetDialogController = useDisclosure();

	/**
	 * Open the 'New Item' dialog
	 */
	const openNewItemDialog = () => {
		setItemDialogMode("new");
		newItemDialogController.onOpen();
	};

	/**
	 * Open the 'Edit Item' dialog
	 *
	 * @param {InventoryItemFields} item The item to edit
	 */
	const openEditItemDialog = (item) => {
		setActiveItem(item);
		setItemDialogMode("edit");
		newItemDialogController.onOpen();
	};

	return (
		<SheetStateProvider
			dispatch={dispatch}
			state={{ items, members, name, _id }}
		>
			<Box>
				<Head>
					<title>{name}</title>
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<main>
					<Box padding={2}>
						<Flex justify="space-between">
							{/* Sheet Title */}
							<Flex>
								<Heading paddingBottom="group" marginRight={1}>
									{name}
								</Heading>
								<IconButton
									aria-label="edit sheet settings"
									icon={<CreateOutlineIcon boxSize={6} />}
									onClick={sheetDialogController.onOpen}
									variant="ghost"
									isRound
								/>
							</Flex>
							{/* <Flex
								flexGrow={1}
								paddingLeft="break"
								paddingRight="group"
								justify={["flex-end", "flex-start"]}
							>
								<IconButton
									aria-label="open sheet settings"
									icon={<SettingsOutlineIcon boxSize={6} />}
									onClick={sheetDialogController.onOpen}
								/>
							</Flex> */}
							{/* Sheet settings button */}
							<ColorModeSwitch />
						</Flex>
						<HStack spacing="group">
							{/* Party Members Tags */}
							{members.map((item) => (
								<Tag key={item}>{item}</Tag>
							))}
						</HStack>
					</Box>
					{/* Add New Item Button */}
					<Box padding={2}>
						<Button
							colorScheme="primary"
							onClick={openNewItemDialog}
							width="full"
						>
							Add New Item
						</Button>
					</Box>

					<InventoryTableSheet
						onRowClick={openEditItemDialog}
						items={items}
						marginBottom="break"
					/>

					<Heading as="h2">Member Inventories</Heading>
					<MemberCarryWeightTable />

					{/* Dialogs */}
					<ItemDialog
						controller={newItemDialogController}
						mode={itemDialogMode}
						item={activeItem}
					/>
					<SheetDialog controller={sheetDialogController} />
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
