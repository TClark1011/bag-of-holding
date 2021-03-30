import { Button } from "@chakra-ui/button";
import {
	Box,
	Center,
	Flex,
	Heading,
	HStack,
	LinkBox,
	VStack,
} from "@chakra-ui/layout";
import { appDisplayTitle, appDomain } from "../constants/meta";
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
					<ColorModeSwitch />
					<HStack justify="flex-end">
						<IconLink
							href={infoPageUrl}
							aria-label="link to info page"
							icon={<HelpOutlineIcon boxSize="icon" />}
							variant="ghost"
						/>
						<IconLink
							href={contactPageUrl}
							aria-label="link to contact page"
							icon={<MailOutlineIcon boxSize="icon" />}
							variant="ghost"
						/>
						<GitLink />
					</HStack>
				</Flex>
				{/* Main Content */}
				<Center width="full" minHeight={screenHeight} padding="break">
					<Box>
						<VStack spacing="break" marginBottom="break">
							<Center>
								<BagOfHoldingIcon fill="white" boxSize={[40, 44, 52]} />
							</Center>
							{/* Main Title */}
							<Heading textAlign="center" textStyle="h1" as="h1" width="full">
								{appDisplayTitle}
							</Heading>
							<Heading textAlign="center" textStyle="h2" as="h2" width="full">
								Track your party{"'"}s inventory, no matter what you play
							</Heading>
							<Center>
								<VStack spacing="break">
									<LinkBox href="/new" as={Button} colorScheme="primary">
										Get Started
									</LinkBox>
									<ButtonLink href={infoPageUrl} variant="ghost" size="xs">
										What is this?
									</ButtonLink>
								</VStack>
							</Center>
						</VStack>
						<WelcomeBack />
					</Box>
				</Center>
			</main>
		</>
	);
};

export default Home;
