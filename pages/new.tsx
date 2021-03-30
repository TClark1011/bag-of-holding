import { Center } from "@chakra-ui/layout";
import { use100vh } from "react-div-100vh";

/**
 * Page to take user to when they want to make a new sheet.
 * When the page loads, it makes an api request to fetch a new
 * sheet. Once the server responds with the id of the new sheet,
 * the user is redirected to that sheet's page.
 *
 * @returns {React.ReactElement} Component stuff
 */
const New: React.FC = () => {
	const screenHeight = use100vh();
	return <Center minHeight={screenHeight}>Loading...</Center>;
};

export default New;
