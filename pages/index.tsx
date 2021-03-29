import { Button } from "@chakra-ui/button";
import { Box, Center, Flex, Heading } from "@chakra-ui/layout";
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import { appName } from "../constants/branding";
import WelcomeBack from "../components/domain/Home/WelcomeBack";

/**
 * Home component
 *
 * @returns {React.ReactElement} The home page
 */
const Home: React.FC = () => {
	const [newSheetIsLoading, setNewSheetIsLoading] = useState<boolean>(false);
	const router = useRouter();
	/**
	 * Create a new sheet, then redirect the user to that sheet
	 */
	const getNewSheet = () => {
		setNewSheetIsLoading(true);
		fetch("/api/sheet", { method: "POST" })
			.then((res) => res.json())
			.then((data) => {
				router.push("/" + data);
			})
			.finally(() => setNewSheetIsLoading(false));
	};

	return (
		<Box>
			<Head>
				<title>{appName}</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main>
				<Center width="full" minHeight="100vh">
					<Box>
						<Center>
							<Box maxWidth="400px">
								<Heading textAlign="center" marginBottom={10}>
									Take the hassle out of your inventory
								</Heading>
								<Flex justify="center" marginBottom="break">
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
						<WelcomeBack />
					</Box>
				</Center>
			</main>
		</Box>
	);
};

export default Home;
