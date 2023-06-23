import { Button, Center, Container, Divider, Flex } from "@chakra-ui/react";
import { testIdGeneratorFactory } from "$tests/utils/testUtils";
import {
	infoPageUrl,
	appDisplayTitle,
	appDomain,
	appSlogan,
} from "$root/constants";
import {
	View,
	H1,
	H2,
	ButtonLink,
	BagOfHoldingIcon,
	H3,
	GetStartedButton,
} from "$root/components";
import { getSheetLink } from "$root/utils";
import { FC, useEffect } from "react";
import useRenderLogging from "$root/hooks/useRenderLogging";
import { useRememberedSheets } from "$sheets/store";
import { useNextHydrationMatchWorkaround } from "$root/hooks";
import { MAINTENANCE_MODE } from "$root/config";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import { useGlobalLoading } from "$global-loader";

const getTestId = testIdGeneratorFactory("Home");

export const homePageTestIds = {
	logo: getTestId("logo"),
	infoLink: "infoLink",
};

/**
 * Home component
 *
 * @returns The home page
 */
const Home: FC = () => {
	useRenderLogging("Home");

	const storedRememberedSheets = useRememberedSheets();
	const rememberedSheets = useNextHydrationMatchWorkaround(
		storedRememberedSheets,
		[]
	);

	const { push, prefetch } = useRouter();
	const routerPushMutation = useMutation(push);
	useGlobalLoading(routerPushMutation.isLoading, "Loading sheet...");

	useEffect(() => {
		// We prefetch the remembered sheets manually
		rememberedSheets.forEach((sheet) => prefetch(getSheetLink(sheet.id)));
	}, [rememberedSheets, prefetch]);

	return (
		<View url={appDomain}>
			<Center w="100vw" h="full">
				<Flex direction="column" alignItems="center" w="full">
					{/* Big Icon */}
					<BagOfHoldingIcon
						fill="white"
						boxSize={[36, 40, 44, 52]}
						data-testid={homePageTestIds.logo}
						mb="break"
					/>
					{/* Main Title */}
					<Container centerContent maxW="lg">
						<H1 textAlign="center" mb="group" fontSize={["3xl", "4xl"]}>
							{appDisplayTitle}
						</H1>
						{/* Slogan */}
						<H2 textAlign="center" mb="break" fontSize={["2xl", "3xl"]}>
							{appSlogan}
						</H2>
					</Container>
					{/* Actions */}
					{/* Get Started Button creates a new sheet */}
					<GetStartedButton mb="group" />
					{/* Link to info page */}
					<ButtonLink
						href={infoPageUrl}
						variant="ghost"
						size="xs"
						data-testid={homePageTestIds.infoLink}
					>
						What is this?
					</ButtonLink>
					{/* Display Remembered Sheets */}
					{!MAINTENANCE_MODE && rememberedSheets.length > 0 && (
						<>
							<Divider my="break" w="100vw" maxW="xl" />
							<H3 fontSize="md" mb="group">
								Recently Visited Sheets
							</H3>
							<Center flexWrap="wrap" w={[400, 400, 600]} gap="group">
								{rememberedSheets.map((sheet) => (
									<Button
										onClick={() =>
											routerPushMutation.mutate(getSheetLink(sheet.id))
										}
										variant="outline"
										key={sheet.id}
										w={64}
										justifySelf="center"
										data-testid="remembered-sheet-link"
										size="sm"
									>
										{sheet.name}
									</Button>
								))}
							</Center>
						</>
					)}
				</Flex>
			</Center>
		</View>
	);
};

export default Home;
