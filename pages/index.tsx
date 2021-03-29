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
			.catch(() => setNewSheetIsLoading(false));
	};

	return (
		<Box>
			<Head>
				<title>{appName}</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main>
				<Center width="full" minHeight="100vh" padding="break">
					<Box>
						<Heading
							textAlign="center"
							marginBottom={10}
							textStyle="h1"
							as="h1"
							width="full"
						>
							The {appName}
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
						<WelcomeBack />
					</Box>
				</Center>
			</main>
		</Box>
	);
};

export default Home;
