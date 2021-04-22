import { Button } from "@chakra-ui/button";
import { VStack } from "@chakra-ui/layout";
import { ModalBody, ModalFooter } from "@chakra-ui/modal";
import { useSheetPageState } from "../../../../state/sheetPageState";
import { FilterableItemProperty } from "../../../../types/InventoryItemFields";
import FilterInterface from "../../../templates/FilterInterface";
import SheetDialog from "../../../templates/SheetDialog";

/**
 * Dialog for filtering the table on mobile devices
 *
 * @returns {React.ReactElement} Component stuff
 */
const FilterDialog: React.FC = () => {
	const { filters, closeDialog } = useSheetPageState();
	return (
		<SheetDialog dialogType="filter" header="Filter Inventory">
			<ModalBody>
				<VStack spacing="break" width="full" display="block">
					{Object.entries(filters).map(([property, filter], index) => (
						<FilterInterface
							property={property as FilterableItemProperty}
							/**
							 * Type casting is guaranteed to be safe here, its only required
							 * due to limitation with auto type recognition
							 */
							filter={filter}
							key={index}
						/>
					))}
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

export default FilterDialog;
