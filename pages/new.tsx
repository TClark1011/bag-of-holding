import { Center } from "@chakra-ui/layout";
import axios from "axios";
import { useEffect } from "react";
import { use100vh } from "react-div-100vh";
import { newSheetApiRoute } from "../constants/urls";
import { useRouter } from "next/router";
import getSheetLink from "../utils/getSheetLink";

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
	useEffect(() => {
		console.log("Requesting new sheet");
		axios
			.get(newSheetApiRoute)
			.then((res) => {
				router.push(getSheetLink(res.data));
			})
			.catch((err) => console.log(err))
			.finally(() => console.log("(new) Finished fetching "));
	}, []);

	const screenHeight = use100vh();
	return <Center minHeight={screenHeight}>Loading...</Center>;
};

export default New;
