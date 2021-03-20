import { Box, Heading, List, ListItem, Text } from "@chakra-ui/layout";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import InventorySheetFields from "../types/InventorySheetFields";

/**
 * The page for a specific sheet
 *
 * @param {object} props The component props
 * @param {string} props.name The name of the sheet
 * @param {string[]} props.items The items in the sheet
 * @param props.members
 * @returns {React.ReactElement} Sheet component
 */
const Sheet: React.FC<InventorySheetFields> = ({ name, items, members }) => {
	return (
		<Box>
			<Head>
				<title>A Sheet</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<Heading>{name}</Heading>
				<Text fontWeight="bold">PartyMembers:</Text>
				<List>
					{members.map((item) => (
						<ListItem key={item}>{item}</ListItem>
					))}
				</List>
				<Text fontWeight="bold">Items:</Text>
				<List>
					{items.length ? (
						items.map((item) => <ListItem key={item._id}>{item.name}</ListItem>)
					) : (
						<ListItem>The inventory is currently empty</ListItem>
					)}
				</List>
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
		items: [],
		members: ["Vincent", "Archie", "Sen", "Seath"],
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
