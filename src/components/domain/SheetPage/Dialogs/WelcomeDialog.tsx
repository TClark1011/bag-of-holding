import { Button } from "@chakra-ui/button";
import { VStack } from "@chakra-ui/layout";
import { ModalBody, ModalFooter } from "@chakra-ui/modal";
import { useSheetPageState } from "../../../../state/sheetPageState";
import SheetDialog from "../../../templates/SheetDialog";
import { Paragraph } from "../../../ui/Typography";

/**
 * Dialog that will be displayed the first time a newly
 * created sheet is viewed
 *
 * @returns {React.ReactElement} Component stuff
 */
const WelcomeDialog: React.FC = () => {
	const { closeDialog, openDialog } = useSheetPageState();

	/**
	 * Callback to execute when the close button is clicked. Closes
	 * the dialog and then opens the 'sheetOptions' dialog.
	 */
	const closeButtonOnClick = () => {
		closeDialog();
		openDialog("sheetOptions");
	};
	return (
		<SheetDialog dialogType="welcome" header="Welcome!">
			<ModalBody>
				<VStack spacing="group">
					<Paragraph>
						Before you do anything else, we highly recommend you{" "}
						<b>bookmark this page, otherwise you might lose it!</b>
					</Paragraph>
					<Paragraph>
						Currently the only way for you to get back to this sheet is if you
						save the URL.{" "}
						<b>If you lose the URL to a sheet, {"it's"} gone forever!</b>
					</Paragraph>
					<Paragraph>
						You can share this page with other players by just sending them the
						URL for this sheet. Be careful though, since{" "}
						<b>anyone with the sheet url can edit it!</b>
					</Paragraph>
				</VStack>
			</ModalBody>
			<ModalFooter>
				<Button colorScheme="primary" onClick={closeButtonOnClick}>
					Close
				</Button>
			</ModalFooter>
		</SheetDialog>
	);
};

export default WelcomeDialog;
