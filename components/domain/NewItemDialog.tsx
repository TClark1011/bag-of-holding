import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { SimpleGrid, VStack } from "@chakra-ui/layout";
import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/modal";
import { Select } from "@chakra-ui/select";
import { Textarea } from "@chakra-ui/textarea";
import DialogControlProps from "../../types/DialogControlProps";
import FormItem from "../ui/FormItem";
import NumberField from "../ui/NumberField";

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
			<ModalHeader>Add New Item</ModalHeader>
			<ModalCloseButton />
			<ModalBody>
				<VStack spacing="group">
					<FormItem label="Name" isRequired>
						<Input placeholder="Item name" />
					</FormItem>
					<FormItem label="Category">
						<Input placeholder="eg; 'Weapon' or 'Survival'" />
					</FormItem>
					<FormItem label="Description">
						<Textarea placeholder="Describe the item" />
					</FormItem>
					<SimpleGrid columns={3} spacing="group">
						<FormItem label="Quantity">
							<NumberField />
						</FormItem>
						<FormItem label="Weight">
							<NumberField />
						</FormItem>
						<FormItem label="Value">
							<NumberField />
						</FormItem>
					</SimpleGrid>
					<FormItem label="Carried By">
						<Select>
							<option value="">Select Item</option>
							<option>Vincent</option>
						</Select>
					</FormItem>
					<FormItem label="Reference">
						<Input placeholder="Link to more info" />
					</FormItem>
				</VStack>
			</ModalBody>

			<ModalFooter>
				<Button colorScheme="secondary">Create Item</Button>
			</ModalFooter>
		</ModalContent>
	</Modal>
);

export default NewItemDialog;
