import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Heading, HStack } from "@chakra-ui/layout";
import { Tag } from "@chakra-ui/tag";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { Reducer, useReducer } from "react";
import NewItemDialog from "../components/domain/NewItemDialog";
import SheetInventoryTable from "../components/domain/SheetInventoryTable";
import { getRandomInventoryItems } from "../fixtures/itemFixtures";
import { averageMembersFixture } from "../fixtures/membersFixtures";
import InventoryItemFields from "../types/InventoryItemFields";
import InventorySheetFields from "../types/InventorySheetFields";
import InventoryStateAction from "../types/InventoryStateAction";
import inventoryStateReducer from "../utils/inventoryStateReducer";

/**
 * The page for a specific sheet
 *
 * @param {object} props The component props
 * @param {string} props.name The name of the sheet
 * @param {string[]} props.items The items in the sheet
 * @param {string[]} props.members Members
 * @returns {React.ReactElement} Sheet component
 */
const Sheet: React.FC<InventorySheetFields> = ({ name, items, members }) => {
	const [inventoryState, dispatchInventoryAction] = useReducer<
		Reducer<InventoryItemFields[], InventoryStateAction>
	>(inventoryStateReducer, items);

	const newItemDialogController = useDisclosure();

	return (
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
				<SheetInventoryTable items={inventoryState} compactMode={true} />
			</main>
		</Box>
	);
};

/**
 * Get the static props
 *
 * @returns {GetStaticPropsResult<InventorySheetFields>} The props for the sheet
 */
export const getStaticProps: GetStaticProps<InventorySheetFields> = async () => ({
	props: {
		name: "Test Sheet",
		items: getRandomInventoryItems(),
		members: averageMembersFixture,
	},
});

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
