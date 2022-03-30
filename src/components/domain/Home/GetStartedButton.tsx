import { ButtonProps } from "@chakra-ui/react";
import { MAINTENANCE_MODE } from "$root/config";
import { H3, ButtonLink } from "$root/components";

/**
 * Button to create a new sheet.
 * Links to the 'new' page which triggers the sheet
 * creation process.
 *
 * @param props The props of a Chakra UI
 * button props.
 * @returns The rendered button
 */
const GetStartedButton: React.FC<ButtonProps> = (props) => {
	return MAINTENANCE_MODE ? (
		<H3>Currently Undergoing Maintenance</H3>
	) : (
		<ButtonLink href="/new" colorScheme="primary" {...props}>
			Get Started
		</ButtonLink>
	);
};

export default GetStartedButton;
