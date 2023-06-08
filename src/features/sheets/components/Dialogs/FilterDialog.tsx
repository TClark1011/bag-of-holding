import {
	Button,
	VStack,
	ModalBody,
	ModalFooter,
	ModalContent,
	ModalOverlay,
	Modal,
} from "@chakra-ui/react";
import { FilterableItemProperty } from "$sheets/types";
import { FilterInterface } from "$sheets/components";
import { useInventoryStoreDispatch, useInventoryStore } from "$sheets/store";
import { D } from "@mobily/ts-belt";
import useRenderLogging from "$root/hooks/useRenderLogging";
import { useIsMobile } from "$root/hooks";

const useFilterDialogModalProps = () => {
	const dispatch = useInventoryStoreDispatch();
	const isMobile = useIsMobile();
	const filterDialogIsOpen = useInventoryStore((s) => s.ui.filterDialogIsOpen);
	const onClose = () => {
		dispatch({
			type: "ui.close-filter-dialog",
		});
	};

	return { isOpen: filterDialogIsOpen && !isMobile, onClose };
};

/**
 * Dialog for filtering the table on mobile devices
 *
 * @returns Component stuff
 */
const FilterDialog: React.FC = () => {
	useRenderLogging("FilterDialog");
	const modalProps = useFilterDialogModalProps();
	const filters = useInventoryStore((s) => s.ui.filters);
	return (
		<Modal {...modalProps}>
			<ModalOverlay />
			<ModalContent>
				<ModalBody>
					<VStack spacing="break" width="full" display="block">
						{D.toPairs(filters).map(([property, filter], index) => (
							<FilterInterface
								heading={
									property === "carriedByCharacterId"
										? "Carried By"
										: "Category"
								}
								property={property as FilterableItemProperty}
								/**
								 * Type casting is guaranteed to be safe here, its only required
								 * due to limitation with auto type recognition
								 */
								filter={filter ?? []}
								key={index}
							/>
						))}
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

export default FilterDialog;
