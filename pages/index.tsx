import { Button } from "@chakra-ui/button";
import { Box, Center, Flex, Heading } from "@chakra-ui/layout";
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";

/**
 * Home component
 *
 * @returns {React.ReactElement} The home page
 */
const Home: React.FC = () => {
	const [newSheetIsLoading, setNewSheetIsLoading] = useState<boolean>(false);
	const router = useRouter();
	/**
	 *
	 */
	const getNewSheet = () => {
		setNewSheetIsLoading(true);
		fetch("/api/sheet", { method: "POST" })
			.then((res) => res.json())
			.then((data) => {
				router.push("/" + data);
			});
	};
	return (
		<Box>
			<Head>
				<title>Create Next App</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main>
				<Center width="full" minHeight="100vh">
					<Box maxWidth="400px">
						<Heading textAlign="center" marginBottom={10}>
							Take the hassle out of your inventory
						</Heading>
						<Flex justify="center">
							<Button
								onClick={getNewSheet}
								isLoading={newSheetIsLoading}
								colorScheme="primary"
							>
								Get Started
							</Button>
						</Flex>
					</Box>
				</Center>
			</main>
		</Box>
	);
};

export default Home;
