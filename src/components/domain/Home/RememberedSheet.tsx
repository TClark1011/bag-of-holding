import { Button } from "@chakra-ui/button";
import { BoxProps } from "@chakra-ui/layout";
import { InventorySheetMenuItemFields } from "../../../types/InventorySheetFields";
import Link from "next/link";
import getSheetLink from "../../../utils/getSheetLink";

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
