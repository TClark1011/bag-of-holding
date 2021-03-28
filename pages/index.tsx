import { Button } from "@chakra-ui/button";
import {
	Box,
	Center,
	Flex,
	Heading,
	HStack,
	Link,
	SimpleGrid,
} from "@chakra-ui/layout";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { appName } from "../constants/branding";
import { fetchRememberedSheets } from "../utils/rememberSheets";
import { InventorySheetMenuItemFields } from "../types/InventorySheetFields";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { Tag } from "@chakra-ui/tag";

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

	const [rememberedSheets, setRememberedSheets] = useState<
		InventorySheetMenuItemFields[]
	>([]);
	useEffect(() => {
		setRememberedSheets(fetchRememberedSheets());
	}, []);

	const rememberedSheetCardBgColor = useColorModeValue("gray.100", "gray.700");

	return (
		<Box>
			<Head>
				<title>{appName}</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main>
				<Center width="full" minHeight="100vh">
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
						<SimpleGrid columns={[2, 3, 4, 5]}>
							{rememberedSheets.map(({ _id, name, members }, index) => (
								<Box
									key={index}
									padding="break"
									boxShadow="lg"
									backgroundColor={rememberedSheetCardBgColor}
									borderRadius="xl"
									variant="ghost"
									width={52}
									height="100%"
								>
									<Link href={_id}>
										<Button width="full" variant="ghost" marginBottom="group">
											{name}
										</Button>
									</Link>
									<HStack>
										{members.map((item, index) => (
											<Tag key={index}>{item}</Tag>
										))}
									</HStack>
								</Box>
							))}
						</SimpleGrid>
					</Box>
				</Center>
			</main>
		</Box>
	);
};

export default Home;
