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
import { InventoryFilters } from "../../reducers/sheetPageReducer";
import DialogControlProps from "../../types/DialogControlProps";
import { FilterableItemProperty } from "../../types/InventoryItemFields";
import FilterInterface from "../templates/FilterInterface";

interface Props extends DialogControlProps {
	filters: InventoryFilters;
	getOnChange: (item: FilterableItemProperty) => (item: string) => void;
}

/**
 * Dialog for filtering the table on mobile devices
 *
 * @param {object} props The props
 * @param {InventoryFilters} props.filters The filters
 * being applied to the item
 * @param {boolean} props.isOpen If the dialog is open
 * @param {Function} props.onClose Callback to execute to
 * close the dialog
 * @param {Function} props.getOnChange Generate the
 * 'onChange' props for each filter interface
 * @returns {React.ReactElement} Component stuff
 */
const FilterDialog: React.FC<Props> = ({
	filters,
	isOpen,
	onClose,
	getOnChange,
}) => {
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
								onChange={getOnChange(property as FilterableItemProperty)}
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
