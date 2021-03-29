import { Button } from "@chakra-ui/button";
import { Box, Center, Heading, VStack } from "@chakra-ui/layout";
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import { appDisplayTitle, appName } from "../constants/branding";
import WelcomeBack from "../components/domain/Home/WelcomeBack";
import BagOfHoldingIcon from "../components/icons/BagOfHoldingIcon";

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
						<VStack spacing="break" marginBottom="break">
							<Center>
								<BagOfHoldingIcon fill="white" boxSize={52} />
							</Center>
							{/* Main Title */}
							<Heading textAlign="center" textStyle="h1" as="h1" width="full">
								{appDisplayTitle}
							</Heading>
							<Heading textAlign="center" textStyle="h2" as="h2" width="full">
								Inventory made easy
							</Heading>
							<Center>
								<Button
									onClick={getNewSheet}
									isLoading={newSheetIsLoading}
									colorScheme="primary"
								>
									Get Started
								</Button>
							</Center>
						</VStack>
						<WelcomeBack />
					</Box>
				</Center>
			</main>
		</Box>
	);
};

export default Home;
