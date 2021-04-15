import { Box, Center, Divider, Link, VStack } from "@chakra-ui/layout";
import GetStartedButton from "../components/domain/GetStartedButton";
import View from "../components/templates/View";
import { H3, Paragraph, SectionTitle } from "../components/ui/Typography";
import { appGitLink } from "../constants/branding";
import { infoPageUrl } from "../constants/urls";
import { testIdGeneratorFactory } from "../utils/testUtils";

const getTestId = testIdGeneratorFactory("TestPage");

export const infoPageTestIds = {
	sectionTitle: getTestId("sectionTitle"),
	explanationQuestion: getTestId("explanationQuestion"),
	getStarted: getTestId("getStarted"),
	gitLink: getTestId("gitLink"),
};

/**
 * @param root0
 * @param root0.title
 * @param root0.chilren
 * @param root0.children
 */
const InfoPageQuestion: React.FC<{ title: string }> = ({
	title,
	children,
	...props
}) => (
	<Box width="full" {...props}>
		<H3 marginBottom={4} textAlign="center">
			{title}
		</H3>
		<VStack spacing={4}>{children}</VStack>
	</Box>
);

/**
 *
 */
const InfoPage: React.FC = () => {
	return (
		<View
			title="Bag of Holding | Info"
			description="Information about Bag of Holding"
			url={infoPageUrl}
		>
			<Box paddingX={[0, 16, 32, 64, 96]}>
				<SectionTitle data-testid={infoPageTestIds.sectionTitle}>
					Info
				</SectionTitle>
				<VStack spacing="break">
					<InfoPageQuestion
						title="What is Bag of Holding?"
						data-testid={infoPageTestIds.explanationQuestion}
					>
						<Paragraph>
							Bag of Holding is a web app that {"let's"} tabletop RPG players
							track their {"group's"} inventory with ease.
						</Paragraph>
						<Paragraph>
							The standard approach to RPG inventory is for each play to track
							their own individual inventory, with a single player often elected
							to keep track of items that are shared amongst the party.
						</Paragraph>
						<Paragraph>
							Now groups can break away from this approach, with a single
							central location to track {"everybody's"} inventory in a single
							place, collaboration becomes easy.
						</Paragraph>
						<Paragraph>
							With features like searching, sorting and filtering items by who
							is carrying them, players can still track their own inventory
							quickly and conveniently.
						</Paragraph>
					</InfoPageQuestion>
					<InfoPageQuestion title="How Do I Save My Sheet?">
						<Paragraph>
							Inventory sheets are automatically saved on our servers whenever
							you make a change.
						</Paragraph>
						<Paragraph>
							To make sure you can access your sheet again at a later date, you
							should make sure to save your {"sheet's"} URL to your{" "}
							{"browser's"} bookmarks. Remember, if you lose the URL to your
							sheet, then you {"won't"} be able to access it!
						</Paragraph>
					</InfoPageQuestion>
					<InfoPageQuestion title="Can I Help?">
						<Paragraph>
							Bag of Holding is an open source project and we welcome anybody
							who wants to help!
						</Paragraph>
						<Paragraph>
							If you have experience with Javascript and want to help, check out{" "}
							<Link
								href={appGitLink}
								color="primary.500"
								data-testid={infoPageTestIds.gitLink}
							>
								the github
							</Link>{" "}
							and reach out!
						</Paragraph>
					</InfoPageQuestion>
				</VStack>
				<Divider marginY="break" background="white" />
				<Center paddingBottom="break">
					<GetStartedButton data-testid={infoPageTestIds.getStarted} />
				</Center>
			</Box>
		</View>
	);
};

export default InfoPage;
