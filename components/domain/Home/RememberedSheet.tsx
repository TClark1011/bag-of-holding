import { Button } from "@chakra-ui/button";
import { BoxProps } from "@chakra-ui/layout";
import { InventorySheetMenuItemFields } from "../../../types/InventorySheetFields";
import Link from "next/link";

/**
 * Component displaying a remembered sheet on the homepage
 *
 * @param {object} props The props
 * @param {string} props.name The name of the sheet
 * @param {string} props._id The id of the sheet used to
 * generate the link to the sheet
 * @returns {React.ReactElement} Component stuff
 */
const RememberedSheet: React.FC<BoxProps & InventorySheetMenuItemFields> = ({
	name,
	_id,
}) => {
	return (
		<Link href={_id}>
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
