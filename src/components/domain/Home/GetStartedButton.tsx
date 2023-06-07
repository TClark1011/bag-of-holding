import { Button, StyleProps } from "@chakra-ui/react";
import { MAINTENANCE_MODE } from "$root/config";
import { H3 } from "$root/components";
import { useState } from "react";
import { useRouter } from "next/router";
import { getSheetLink } from "$root/utils";
import queries from "$root/hooks/queries";

/**
 * Button to create a new sheet.
 * Links to the 'new' page which triggers the sheet
 * creation process.
 *
 * @param props The props of a Chakra UI
 * button props.
 * @returns The rendered button
 */
const GetStartedButton: React.FC<StyleProps> = (props) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const createSheetMutation = queries.sheet.create.useMutation({
		onMutate: () => {
			setIsLoading(true);
		},
		onError: () => {
			setIsLoading(false);
			// We could just use the `isLoading` state on the query, however this
			// method means the loader will appear all the way until the page is
			// replaced, rather than just until the query is finished
		},
		onSuccess: (data) => {
			const path = getSheetLink(data.id);
			router.push(`${path}?new`, path);
		},
	});

	if (MAINTENANCE_MODE) return <H3>Currently Undergoing Maintenance</H3>;
	return (
		<Button
			colorScheme="primary"
			id="new-sheet-button"
			isLoading={isLoading}
			loadingText="Creating Sheet..."
			onClick={() => createSheetMutation.mutate()}
			{...props}
		>
			Get Started
		</Button>
	);
};

export default GetStartedButton;
