import useRenderLogging from "$root/hooks/useRenderLogging";
import { useInventoryStore, useInventoryStoreDispatch } from "$sheets/store";
import {
	Button,
	VStack,
	ModalBody,
	ModalFooter,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
} from "@chakra-ui/react";

const useWelcomeDialogModalProps = () => {
	const dispatch = useInventoryStoreDispatch();
	const isOpen = useInventoryStore((s) => s.ui.welcomeDialogIsOpen);

	const onClose = () => {
		dispatch({
			type: "ui.close-welcome-dialog",
		});
		dispatch({
			type: "ui.open-sheet-name-dialog",
		});
	};

	return { isOpen, onClose };
};

/**
 * Dialog that will be displayed the first time a newly
 * created sheet is viewed
 *
 * @returns Component stuff
 */
const WelcomeDialog: React.FC = () => {
	useRenderLogging("WelcomeDialog");

	const modalProps = useWelcomeDialogModalProps();
	return (
		<Modal {...modalProps} closeOnOverlayClick={false} closeOnEsc={false}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Welcome!</ModalHeader>
				<ModalBody>
					<VStack spacing="group">
						<p>
							Before you do anything else, we highly recommend you{" "}
							<b>bookmark this page, otherwise you might lose it!</b>
						</p>
						<p>
							Currently the only way for you to get back to this sheet is if you
							save the URL.{" "}
							<b>If you lose the URL to a sheet, {"it's"} gone forever!</b>
						</p>
						<p>
							You can share this page with other players by just sending them
							the URL for this sheet. Be careful though, since{" "}
							<b>anyone with the sheet url can edit it!</b>
						</p>
					</VStack>
				</ModalBody>
				<ModalFooter>
					<Button colorScheme="primary" onClick={modalProps.onClose}>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default WelcomeDialog;
