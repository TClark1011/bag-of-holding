import { Box, Heading } from "@chakra-ui/layout";
import Head from "next/head";

/**
 * The page for a specific sheet
 *
 * @returns {React.ReactElement} Sheet component
 */
const Sheet: React.FC = () => {
	return (
		<Box>
			<Head>
				<title>A Sheet</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<Heading>Sheet!</Heading>
			</main>
		</Box>
	);
};

export default Sheet;
