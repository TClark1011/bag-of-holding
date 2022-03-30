import { Box, Center, VStack } from "@chakra-ui/react";
import { testIdGeneratorFactory } from "$tests/utils/testUtils";
import {
	infoPageUrl,
	appDisplayTitle,
	appDomain,
	appSlogan,
} from "$root/constants";
import {
	GetStartedButton,
	View,
	H1,
	H2,
	ButtonLink,
	BagOfHoldingIcon,
	WelcomeBack,
} from "$root/components";

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
const Home: React.FC = () => {
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
								<GetStartedButton />
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
