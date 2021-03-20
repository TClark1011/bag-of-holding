import { Heading } from "@chakra-ui/layout";
import Head from "next/head";

/**
 * Home component
 *
 * @returns {React.ReactElement} The home page
 */
const Home: React.FC = () => (
	<div>
		<Head>
			<title>Create Next App</title>
			<link rel="icon" href="/favicon.ico" />
		</Head>

		<main>
			<Heading>This is the homepage</Heading>
		</main>
	</div>
);

export default Home;
