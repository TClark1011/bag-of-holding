import { Center } from "@chakra-ui/layout";
import PageContentContainer from "../components/domain/PageContentContainer";
import View from "../components/templates/View";
import ButtonLink from "../components/ui/ButtonLink";
import { Paragraph, SectionTitle } from "../components/ui/Typography";
import { appName, contactEmailAddress } from "../constants/branding";
import { contactPageUrl } from "../constants/urls";
import createPageTitle from "../utils/createPageTitle";

export const contactPageTitle = "Contact";

/**
 * The page containing contact information
 *
 * @returns {React.ReactElement} The contact page
 */
const ContactPage: React.FC = () => {
	console.warn(
		`Please confirm that contact email '${contactEmailAddress}' successfully forwards emails`
	);

	return (
		<View title={createPageTitle("Contact")} url={contactPageUrl}>
			<PageContentContainer>
				<SectionTitle data-testid={contactPageTitle}>Contact</SectionTitle>
				<Paragraph textAlign="center">
					If you are having a problem with {appName} you can reach out at the
					following email address:
				</Paragraph>
				<Center marginY="break">
					<ButtonLink href={"mailto:"}>{contactEmailAddress}</ButtonLink>
				</Center>
			</PageContentContainer>
		</View>
	);
};

export default ContactPage;
