import { Button } from "@chakra-ui/button";
import { useDisclosure, useInterval } from "@chakra-ui/hooks";
import { Box, Heading, HStack } from "@chakra-ui/layout";
import { Tag } from "@chakra-ui/tag";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { Reducer, useReducer } from "react";
import NewItemDialog from "../components/domain/NewItemDialog";
import InventoryTableSheet from "../components/domain/InventorySheetTable";
import InventorySheetFields from "../types/InventorySheetFields";
import InventorySheetState, {
	InventorySheetStateAction,
} from "../types/InventorySheetState";
import inventorySheetStateReducer from "../utils/inventorySheetStateReducer";
import { fetchSheetFromMongo } from "../utils/fetchSheet";
import getUrlParam from "../utils/getUrlParam";
import deepEqual from "deep-equal";
import SheetStateProvider from "../components/contexts/SheetStateContext";

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
	const [{ items, name, members, _id }, dispatch] = useReducer<
		Reducer<InventorySheetState, InventorySheetStateAction>
	>(inventorySheetStateReducer, {
		...sheetFields,
		isAhead: false,
		isLoading: false,
	});

	useInterval(
		() =>
			//? Regularly refetch data
			fetch("/api/1")
				.then((res) => res.json())
				.then((data) => {
					if (!deepEqual(data, { items, name, members })) {
						dispatch({ type: "sheet_update", data });
					}
				}),
		3000
	);

	const newItemDialogController = useDisclosure();

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
					<Button
						colorScheme="secondary"
						onClick={newItemDialogController.onOpen}
					>
						Add New Item
					</Button>
					<NewItemDialog controller={newItemDialogController} />
					<InventoryTableSheet items={items} compactMode={true} />
				</main>
			</Box>
		</SheetStateProvider>
	);
};

/**
 * Get the static props
 *
 * @param {object} context Path context data
 * @param {object} context.params Path url parameters
 * @param {string | string[]} context.params.sheetId The sheet id in the ur;
 * @returns {GetStaticPropsResult<InventorySheetFields>} The props for the sheet
 */
export const getStaticProps: GetStaticProps<InventorySheetFields> = async (
	context
) => {
	return {
		props: await fetchSheetFromMongo(getUrlParam(context.params.sheetId)),
	};
};

/**
 * Determine static paths to pre render
 *
 * @returns {GetStaticPathsResult} Data for pre rendering paths
 */
export const getStaticPaths: GetStaticPaths = async () => {
	const paths = [
		{
			params: { sheetId: "1" },
		},
	]; //This will replaced with a map function that returns an array with all the sheets that exist in the database
	return {
		paths,
		fallback: true,
	};
};

export default Sheet;
