import { Center } from "@chakra-ui/react";
import { createPageTitle } from "$root/utils";
import { contactPageUrl, appName, contactEmailAddress } from "$root/constants";
import {
	Paragraph,
	SectionTitle,
	ButtonLink,
	PageContentContainer,
	View,
} from "$root/components";

export const contactPageTitle = "Contact";

/**
 * The page containing contact information
 *
 * @returns The contact pageobsiob
 */
const ContactPage: React.FC = () => {
	return (
		<View
			title={createPageTitle("Contact")}
			url={contactPageUrl}
			description={`Contact details for ${appName} support`}
			analyticsPageViewProps={{ title: "Contact" }}
		>
			<PageContentContainer>
				<SectionTitle data-testid={contactPageTitle}>Contact</SectionTitle>
				<Paragraph textAlign="center">
					If you are having a problem with {appName} you can reach out at the
					following email address:
				</Paragraph>
				<Center marginY="break">
					<ButtonLink href={`mailto:${contactEmailAddress}`}>
						{contactEmailAddress}
					</ButtonLink>
				</Center>
			</PageContentContainer>
		</View>
	);
};

export default ContactPage;
