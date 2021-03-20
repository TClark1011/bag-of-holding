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
import DialogControlProps from "../../types/DialogControlProps";

/**
 * Modal dialog for creating a new item
 *
 * @param {object} props props
 * @param {UseDisclosureReturn} props.controller Object with methods for controlling
 * the state of the dialog
 * @returns {React.ReactElement} The rendered HTML
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
