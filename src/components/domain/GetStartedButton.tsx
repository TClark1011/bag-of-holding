import { ButtonProps } from "@chakra-ui/button";
import { MAINTENANCE_MODE } from "../../config/publicEnv";
import ButtonLink from "../ui/ButtonLink";
import { H3 } from "../ui/Typography";

/**
 * Button to create a new sheet.
 * Links to the 'new' page which triggers the sheet
 * creation process.
 *
 * @param {object} props The props of a Chakra UI
 * button props.
 * @returns {React.ReactElement} The rendered button
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
