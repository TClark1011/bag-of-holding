import { Button } from "@chakra-ui/button";
import { VStack } from "@chakra-ui/layout";
import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/modal";
import { useSheetPageState } from "../../state/sheetPageState";
import DialogControlProps from "../../types/DialogControlProps";
import { FilterableItemProperty } from "../../types/InventoryItemFields";
import FilterInterface from "../templates/FilterInterface";

/**
 * Dialog for filtering the table on mobile devices
 *
 * @param {object} props The props
 * @param {boolean} props.isOpen If the dialog is open
 * @param {Function} props.onClose Callback to execute to
 * @returns {React.ReactElement} Component stuff
 */
const FilterDialog: React.FC<DialogControlProps> = ({ isOpen, onClose }) => {
	const { filters } = useSheetPageState();
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Filter Items</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<VStack spacing="break" width="full" display="block">
						{Object.entries(filters).map(([property, filter], index) => (
							<FilterInterface
								property={property as FilterableItemProperty}
								// Type casting is guaranteed to be safe here, its only required due to limitation with auto type recognition
								filter={filter}
								key={index}
							/>
						))}
					</VStack>
				</ModalBody>
				<ModalFooter>
					<Button colorScheme="primary" onClick={onClose}>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default FilterDialog;
