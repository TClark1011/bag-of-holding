import { Button } from "@chakra-ui/button";
import { Box, Heading, HStack } from "@chakra-ui/layout";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import { Tag } from "@chakra-ui/tag";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { Reducer, useReducer } from "react";
import { getRandomInventoryItems } from "../fixtures/itemFixtures";
import { averageMembersFixture } from "../fixtures/membersFixtures";
import InventoryItemFields from "../types/InventoryItemFields";
import InventorySheetFields from "../types/InventorySheetFields";
import InventoryStateAction from "../types/InventoryStateAction";
import inventoryStateReducer from "../utils/inventoryStateReducer";

const numericTableCellProps = {
	paddingX: 2,
	sx: { textAlign: "center" },
};

const tableHeaderProps = {
	color: "gray.50",
};

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
					onClick={() =>
						dispatchInventoryAction({
							type: "item_add",
							data: { name: "Newly added item" },
						})
					}
				>
					Add Item
				</Button>
				<Table colorScheme="gray">
					<Thead>
						<Tr backgroundColor="primary.500">
							<Th {...tableHeaderProps}>Name</Th>
							<Th {...numericTableCellProps} {...tableHeaderProps}>
								Quantity
							</Th>
							<Th {...numericTableCellProps} {...tableHeaderProps}>
								Weight*
							</Th>
						</Tr>
					</Thead>
					<Tbody>
						{inventoryState.map(({ _id, name, quantity, weight }) => (
							<Tr key={_id}>
								<Td>{name}</Td>
								<Td {...numericTableCellProps}>{quantity}</Td>
								<Td {...numericTableCellProps}>{weight * quantity}</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
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
