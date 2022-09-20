import { Button, BoxProps } from "@chakra-ui/react";
import { SheetMenuItemFields } from "$sheets/types";
import Link from "next/link";
import { getSheetLink } from "$root/utils";

/**
 * Component displaying a remembered sheet on the homepage
 *
 * @param props The props
 * @param props.name The name of the sheet
 * @param props.id The id of the sheet used to
 * generate the link to the sheet
 * @returns Component stuff
 */
const RememberedSheet: React.FC<BoxProps & SheetMenuItemFields> = ({
	name,
	id,
}) => {
	return (
		<Link href={getSheetLink(id)}>
			<Button
				variant="outline"
				colorScheme="primary"
				width="full"
				marginBottom="group"
			>
				{name}
			</Button>
		</Link>
	);
};

export default RememberedSheet;
