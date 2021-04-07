import { Box, Center, Flex, HStack, VStack } from "@chakra-ui/layout";
import { appDisplayTitle, appDomain, appSlogan } from "../constants/branding";
import WelcomeBack from "../components/domain/Home/WelcomeBack";
import BagOfHoldingIcon from "../components/icons/BagOfHoldingIcon";
import { use100vh } from "react-div-100vh";
import Meta from "../components/templates/Meta";
import ColorModeSwitch from "../components/ui/ColorModeSwitch";
import GitLink from "../components/ui/GitLink";
import { HelpOutlineIcon, MailOutlineIcon } from "chakra-ui-ionicons";
import IconLink from "../components/ui/IconLink";
import ButtonLink from "../components/ui/ButtonLink";
import { contactPageUrl, infoPageUrl } from "../constants/urls";
import { H1, H2 } from "../components/ui/Typography";
import { testIdGeneratorFactory } from "../utils/testUtils";

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
	const screenHeight = use100vh();

	return (
		<>
			<Meta url={appDomain} />
			<main>
				{/* Top Bar */}
				<Flex
					justify="space-between"
					padding={2}
					width="full"
					position="absolute"
				>
					<HStack justify="flex-end">
						<GitLink data-testid={homePageTestIds.gitLink} />
						<IconLink
							display="none"
							href={contactPageUrl}
							aria-label="link to contact page"
							icon={<MailOutlineIcon boxSize="icon" />}
							variant="ghost"
							data-testid={homePageTestIds.contactLink}
						/>
						<IconLink
							display="none"
							href={infoPageUrl}
							aria-label="link to info page"
							icon={<HelpOutlineIcon boxSize="icon" />}
							variant="ghost"
							data-testid={homePageTestIds.infoLink}
						/>
					</HStack>
					<ColorModeSwitch />
				</Flex>
				{/* Main Content */}
				<Center width="full" minHeight={screenHeight} padding="break">
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
			</main>
		</>
	);
};

export default Home;
