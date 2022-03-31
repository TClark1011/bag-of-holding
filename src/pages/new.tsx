import {
	Box,
	Center,
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Spinner,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { use100vh } from "react-div-100vh";
import { useRouter } from "next/router";
import { useNewSheetPageState } from "$sheets/store";
import { requestNewSheet } from "$sheets/api";
import { getSheetLink } from "$root/utils";
import { H3, View } from "$root/components";
import {
	useAnalyticsEventLogger,
	useAnalyticsExceptionLogger,
} from "$analytics/hooks";

/**
 * Page to take user to when they want to make a new sheet.
 * When the page loads, it makes an api request to fetch a new
 * sheet. Once the server responds with the id of the new sheet,
 * the user is redirected to that sheet's page.
 *
 * @returns Component stuff
 */
const New: React.FC = () => {
	const router = useRouter();
	const { errorHasOccurred, turnOnError } = useNewSheetPageState();
	const logAnalyticsEvent = useAnalyticsEventLogger();
	const logAnalyticsException = useAnalyticsExceptionLogger();

	useEffect(() => {
		requestNewSheet()
			.then((res) => {
				const newSheetUrl = getSheetLink(res.data);
				router.replace(newSheetUrl + "?new", newSheetUrl);
				logAnalyticsEvent("Sheet", "New Sheet Created");
			})
			.catch((err) => {
				turnOnError();
				logAnalyticsException("Failed to create new sheet.", {
					fatal: true,
					extraData: err.message,
				});
			});
	}, []);

	const screenHeight = use100vh();
	return (
		<View
			title="Creating New Sheet..."
			analyticsPageViewProps={{ title: "New Sheet Loading Screen" }}
		>
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
		</View>
	);
};

export default New;
