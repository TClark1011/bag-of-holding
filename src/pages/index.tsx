import { Box, Center, VStack } from "@chakra-ui/layout";
import { appDisplayTitle, appDomain, appSlogan } from "../constants/branding";
import WelcomeBack from "../components/domain/Home/WelcomeBack";
import BagOfHoldingIcon from "../components/icons/BagOfHoldingIcon";
import ButtonLink from "../components/ui/ButtonLink";
import { H1, H2 } from "../components/ui/Typography";
import { testIdGeneratorFactory } from "../utils/testUtils";
import View from "../components/templates/View";
import { infoPageUrl } from "../constants/urls";
import GetStartedButton from "../components/domain/GetStartedButton";

const getTestId = testIdGeneratorFactory("Home");

export const homePageTestIds = {
	logo: getTestId("logo"),
	infoLink: "infoLink",
};

/**
 * Home component
 *
 * @returns {React.ReactElement} The home page
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
