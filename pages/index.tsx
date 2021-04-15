import { Box, Center, VStack } from "@chakra-ui/layout";
import { appDisplayTitle, appDomain, appSlogan } from "../constants/branding";
import WelcomeBack from "../components/domain/Home/WelcomeBack";
import BagOfHoldingIcon from "../components/icons/BagOfHoldingIcon";
import ButtonLink from "../components/ui/ButtonLink";
import { H1, H2 } from "../components/ui/Typography";
import { testIdGeneratorFactory } from "../utils/testUtils";
import View from "../components/templates/View";
import { infoPageUrl } from "../constants/urls";

const getTestId = testIdGeneratorFactory("Home");

export const homePageTestIds = {
	logo: getTestId("Logo"),
	gitLink: getTestId("GitLink"),
	contactLink: getTestId("ContactLink"),
	infoLink: getTestId("InfoLink"),
};

/**
 * Home component
 *
 * @returns {React.ReactElement} The home page
 */
const Home: React.FC = () => {
	return (
		<View showHomeLink={false} url={appDomain}>
			<Center width="full" height="100%" padding="break" id="homepage-center">
				<Box>
					<VStack spacing="break" marginBottom="break">
						<Center>
							<BagOfHoldingIcon
								fill="white"
								boxSize={[40, 44, 52]}
								data-testid={homePageTestIds.logo}
							/>
						</Center>
						{/* Main Title */}
						<H1 textAlign="center">{appDisplayTitle}</H1>
						<H2 textAlign="center">{appSlogan}</H2>
						<Center>
							<VStack spacing="break">
								<ButtonLink href="/new" colorScheme="primary">
									Get Started
								</ButtonLink>
								<ButtonLink
									href={infoPageUrl}
									variant="ghost"
									size="xs"
									display="none"
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
