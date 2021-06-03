import { Box, Center, Divider, Link, VStack } from "@chakra-ui/layout";
import React from "react";
import PageContentContainer from "../components/domain/PageContentContainer";
import GetStartedButton from "../components/domain/GetStartedButton";
import View from "../components/templates/View";
import { H3, Paragraph, SectionTitle } from "../components/ui/Typography";
import { appGitLink } from "../constants/branding";
import { infoPageUrl } from "../constants/urls";
import createPageTitle from "../utils/createPageTitle";
import { testIdGeneratorFactory } from "../utils/testUtils";
import { chakra } from "@chakra-ui/system";

const getTestId = testIdGeneratorFactory("TestPage");
export const infoPageTestIds = {
	sectionTitle: getTestId("sectionTitle"),
	explanationQuestion: getTestId("explanationQuestion"),
	getStarted: getTestId("getStarted"),
	gitLink: getTestId("gitLink"),
};

const InfoPageQuestion = chakra(H3, {
	baseStyle: { textAlign: "center", marginBottom: "break" },
});
//? Use for the question titles

/**
 * The info page
 *
 * @returns {React.ReactElement} The info page content
 */
const InfoPage: React.FC = () => {
	return (
		<View
			title={createPageTitle("Info")}
			url={infoPageUrl}
			analyticsPageViewProps={{ title: "Info" }}
		>
			<PageContentContainer>
				<SectionTitle data-testid={infoPageTestIds.sectionTitle}>
					Info
				</SectionTitle>
				<VStack spacing="break">
					<Box>
						<InfoPageQuestion data-testid={infoPageTestIds.explanationQuestion}>
							What is Bag of Holding?
						</InfoPageQuestion>
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
					</Box>
					<Box>
						<InfoPageQuestion>How Do I Save My Sheet?</InfoPageQuestion>
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
					</Box>
					<Box>
						<InfoPageQuestion>Do Sheets Last Forever?</InfoPageQuestion>
						<Paragraph>
							Unfortunately, storing a lot of data costs money, so we delete
							sheets that have not been edited in a long time.
						</Paragraph>
						<Paragraph>
							If a sheet is created but has no items added to it for a week,
							that sheet will be deleted.
						</Paragraph>
						<Paragraph>
							Sheets that do contain items will still be deleted if they are not
							edited for 6 months. To avoid this happening to your sheets, just
							hop on your sheets every now and then and add a new item and then
							delete it again right after.
						</Paragraph>
					</Box>
					<Box>
						<InfoPageQuestion>Can I Help?</InfoPageQuestion>
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
					</Box>
				</VStack>
				<Divider marginY="break" background="white" />
				<Center paddingBottom="break">
					<GetStartedButton data-testid={infoPageTestIds.getStarted} />
				</Center>
			</PageContentContainer>
		</View>
	);
};

export default InfoPage;
