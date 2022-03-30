import { Button, BoxProps } from "@chakra-ui/react";
import { InventorySheetMenuItemFields } from "$sheets/types";
import Link from "next/link";
import { getSheetLink } from "$root/utils";

/**
 * Component displaying a remembered sheet on the homepage
 *
 * @param props The props
 * @param props.name The name of the sheet
 * @param props._id The id of the sheet used to
 * generate the link to the sheet
 * @returns Component stuff
 */
const RememberedSheet: React.FC<BoxProps & InventorySheetMenuItemFields> = ({
	name,
	_id,
}) => {
	return (
		<Link href={getSheetLink(_id)}>
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
