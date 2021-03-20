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
			<h1>Hello CRA</h1>
		</main>
	</div>
);

export default Home;
