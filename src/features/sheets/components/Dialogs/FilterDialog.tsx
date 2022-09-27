import { Button, VStack, ModalBody, ModalFooter } from "@chakra-ui/react";
import { FilterableItemProperty } from "$sheets/types";
import { SheetDialog, FilterInterface } from "$sheets/components";
import { useSheetPageState } from "$sheets/store";
import { D } from "@mobily/ts-belt";

/**
 * Dialog for filtering the table on mobile devices
 *
 * @returns Component stuff
 */
const FilterDialog: React.FC = () => {
	const { filters, closeDialog } = useSheetPageState();
	return (
		<SheetDialog dialogType="filter" header="Filter Inventory">
			<ModalBody>
				<VStack spacing="break" width="full" display="block">
					{D.toPairs(filters).map(([property, filter], index) => (
						<FilterInterface
							heading={
								property === "carriedByCharacterId" ? "Carried By" : "Category"
							}
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
