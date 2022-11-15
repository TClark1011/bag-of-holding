import { Box, Button, Center, VStack } from "@chakra-ui/react";
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
	WelcomeBack,
} from "$root/components";
import queries from "$root/hooks/queries";
import { useRouter } from "next/router";
import { getSheetLink } from "$root/utils";
import { FC, useState } from "react";
import useRenderLogging from "$root/hooks/useRenderLogging";

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

	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const createSheetMutation = queries.sheet.create.useMutation({
		onMutate: () => {
			setIsLoading(true);
		},
		onError: () => {
			setIsLoading(false);
		},
		onSuccess: (data) => {
			router.replace(getSheetLink(data.id) + "?new", getSheetLink(data.id));
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
							</VStack>
						</Center>
					</VStack>
					<WelcomeBack display="none" />
				</Box>
			</Center>
		</View>
	);
};

export default Home;
