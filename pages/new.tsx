import { Box, Center } from "@chakra-ui/layout";
import axios from "axios";
import { useEffect } from "react";
import { use100vh } from "react-div-100vh";
import { newSheetApiRoute } from "../constants/urls";
import { useRouter } from "next/router";
import getSheetLink from "../utils/getSheetLink";
import { H3 } from "../components/ui/Typography";
import { Spinner } from "@chakra-ui/spinner";
import { useNewSheetPageState } from "../state/newSheetPageState";
import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
} from "@chakra-ui/alert";

/**
 * Page to take user to when they want to make a new sheet.
 * When the page loads, it makes an api request to fetch a new
 * sheet. Once the server responds with the id of the new sheet,
 * the user is redirected to that sheet's page.
 *
 * @returns {React.ReactElement} Component stuff
 */
const New: React.FC = () => {
	const router = useRouter();
	const { errorHasOccurred, turnOnError } = useNewSheetPageState();

	useEffect(() => {
		console.log("Requesting new sheet");
		axios
			.get(newSheetApiRoute)
			.then((res) => {
				router.replace(getSheetLink(res.data));
			})
			.catch(() => {
				turnOnError();
			})
			.finally(() => console.log("(new) Finished fetching "));
	}, []);

	const screenHeight = use100vh();
	return (
		<Center minHeight={screenHeight} padding="break">
			{errorHasOccurred ? (
				<Alert
					status="error"
					colorScheme="error"
					variant="left-accent"
					width="max-content"
				>
					<AlertIcon />
					<AlertTitle>An error has occurred</AlertTitle>
					<AlertDescription>Please try again later</AlertDescription>
				</Alert>
			) : (
				<Box>
					<H3 textAlign="center" marginBottom="break">
						Creating a new sheet
					</H3>
					<Center>
						<Spinner />
					</Center>
				</Box>
			)}
		</Center>
	);
};

export default New;
