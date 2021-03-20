import { Button } from "@chakra-ui/button";
import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/modal";
import DialogControlProps from "../../types/DialogProps";

/**
 * @param root0
 * @param root0.controller
 * @param root0.controller.onOpen
 * @param root0.controller.onClose
 * @param root0.controller.isOpen
 */
const NewItemDialog: React.FC<DialogControlProps> = ({
	controller: { onClose, isOpen },
}) => (
	<Modal isOpen={isOpen} onClose={onClose}>
		<ModalOverlay />
		<ModalContent>
			<ModalHeader>New Item</ModalHeader>
			<ModalCloseButton />
			<ModalBody>stuff will go here</ModalBody>

			<ModalFooter>
				<Button colorScheme="secondary">Create Item</Button>
			</ModalFooter>
		</ModalContent>
	</Modal>
);

export default NewItemDialog;
