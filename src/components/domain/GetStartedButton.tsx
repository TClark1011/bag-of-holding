import { ButtonProps } from "@chakra-ui/button";
import ButtonLink from "../ui/ButtonLink";

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
	return (
		<ButtonLink href="/new" colorScheme="primary" {...props}>
			Get Started
		</ButtonLink>
	);
};

export default GetStartedButton;
