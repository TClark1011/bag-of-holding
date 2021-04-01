import { Button } from "@chakra-ui/button";
import { Text, VStack } from "@chakra-ui/layout";
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
	const { closeDialog } = useSheetPageState();
	return (
		<SheetDialog dialogType="welcome" header="Welcome!">
			<ModalBody>
				<VStack spacing="group">
					<Paragraph>
						Before you do anything else, we highly recommend you{" "}
						<Text fontWeight="bold" as="span">
							bookmark this page, otherwise you might lose it!
						</Text>
					</Paragraph>
					<Paragraph>
						We recommend that your first priority should be to rename your sheet
						and add some party members by clicking the icon to the right of the
						sheet name in the top left corner.
					</Paragraph>
					<Paragraph>
						You can share this page with other players by just sending them the
						URL for this sheet. Be careful though, since{" "}
						<Text fontWeight="bold" as="span">
							anyone with the sheet url can edit it!
						</Text>
					</Paragraph>
				</VStack>
			</ModalBody>
			<ModalFooter>
				<Button colorScheme="primary" onClick={closeDialog}>
					Close
				</Button>
			</ModalFooter>
		</SheetDialog>
	);
};

export default WelcomeDialog;
