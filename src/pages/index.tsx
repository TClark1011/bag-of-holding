import { Box, Button, Center, Divider, VStack } from "@chakra-ui/react";
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
} from "$root/components";
import queries from "$root/hooks/queries";
import { useRouter } from "next/router";
import { getSheetLink } from "$root/utils";
import { FC, useState } from "react";
import useRenderLogging from "$root/hooks/useRenderLogging";
import { useRememberedSheets } from "$sheets/store";
import { useNextHydrationMatchWorkaround } from "$root/hooks";

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

	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const createSheetMutation = queries.sheet.create.useMutation({
		onMutate: () => {
			setIsLoading(true);
		},
		onError: () => {
			setIsLoading(false);
			// We could just use the `isLoading` state on the query, however this
			// method means the loader will appear all the way until the page is
			// replaced, rather than just until the query is finished
		},
		onSuccess: (data) => {
			const path = getSheetLink(data.id);
			router.push(`${path}?new`, path);
		},
	});

	return (
		<View
			accountForTopNav={false}
			url={appDomain}
			analyticsPageViewProps={{ title: "Landing" }}
		>
			<Center width="full" height="100%" padding="break">
				<Box>
					<VStack spacing="break" marginBottom="break">
						<Center>
							{/* Big Icon */}
							<BagOfHoldingIcon
								fill="white"
								boxSize={[40, 44, 52]}
								data-testid={homePageTestIds.logo}
							/>
						</Center>

						{/* Main Title */}
						<H1 textAlign="center">{appDisplayTitle}</H1>
						{/* Slogan */}
						<H2 textAlign="center">{appSlogan}</H2>

						{/* Actions */}
						<Center>
							<VStack spacing="break">
								{/* Get Started Button */}
								<Button
									colorScheme="primary"
									onClick={() => createSheetMutation.mutate()}
									isLoading={isLoading}
									loadingText="Creating Sheet"
								>
									Get Started
								</Button>
								{/* Link to info page */}
								<ButtonLink
									href={infoPageUrl}
									variant="ghost"
									size="xs"
									data-testid={homePageTestIds.infoLink}
								>
									What is this?
								</ButtonLink>

								{rememberedSheets.length > 0 && (
									<>
										<Divider />
										<H3 fontSize="md">Recently Visited Sheets</H3>
										<Center flexWrap="wrap" w={[400, 400, 600]} gap="group">
											{rememberedSheets.map((sheet) => (
												<ButtonLink
													href={getSheetLink(sheet.id)}
													variant="outline"
													key={sheet.id}
													w={64}
													justifySelf="center"
													data-testid="remembered-sheet-link"
												>
													{sheet.name}
												</ButtonLink>
											))}
										</Center>
									</>
								)}
							</VStack>
						</Center>
					</VStack>
				</Box>
			</Center>
		</View>
	);
};

export default Home;
