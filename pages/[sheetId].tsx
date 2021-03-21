import { Button } from "@chakra-ui/button";
import { useDisclosure, useInterval } from "@chakra-ui/hooks";
import { Box, Heading, HStack } from "@chakra-ui/layout";
import { Tag } from "@chakra-ui/tag";
import { GetStaticPaths, GetStaticProps } from "next";
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
import deepEqual from "deep-equal";
import SheetStateProvider from "../components/contexts/SheetStateContext";
import { fetchAllSheets, fetchSheet } from "../db/sheetServices";
import { useRouter } from "next/router";
import InventoryItemFields from "../types/InventoryItemFields";
import { REFETCH_INTERVAL } from "../config/publicEnv";

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
		isLoading: false,
	});

	useEffect(() => {
		dispatch({ type: "sheet_update", data: { ...sheetFields } });
		//? When the sheet's props are updated via refetching, load the new values into state
	}, [sheetFields]);

	const router = useRouter();

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

	/**
	 *
	 */
	const openNewItemDialog = () => {
		setItemDialogMode("new");
		newItemDialogController.onOpen();
	};

	/**
	 * @param item
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
					<title>A Sheet</title>
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<main>
					<Box padding={2}>
						<Heading paddingBottom="group">{name}</Heading>
						<HStack spacing="group">
							{members.map((item) => (
								<Tag key={item}>{item}</Tag>
							))}
						</HStack>
					</Box>
					<Button colorScheme="secondary" onClick={openNewItemDialog}>
						Add New Item
					</Button>
					<ItemDialog
						controller={newItemDialogController}
						mode={itemDialogMode}
						item={activeItem}
					/>
					{/* <InventoryTableSheet items={items} compactMode={true} /> */}
					<InventoryTableSheet
						items={items}
						compactMode={true}
						onRowClick={openEditItemDialog}
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
export const getServerSideProps: GetStaticProps<InventorySheetFields> = async (
	context
) => {
	return {
		props: await fetchSheet(getUrlParam(context.params.sheetId)),
	};
};

export default Sheet;
