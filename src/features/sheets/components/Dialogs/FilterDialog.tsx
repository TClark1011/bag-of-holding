import {
	Button,
	VStack,
	ModalBody,
	ModalFooter,
	ModalContent,
	ModalOverlay,
	Modal,
} from "@chakra-ui/react";
import { BigFilterInterface } from "$sheets/components";
import { useInventoryStoreDispatch, useInventoryStore } from "$sheets/store";
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
 * Dialog for filtering the table on viewports too narrow to view
 * the filterable columns, but not so narrow to be considered mobile.
 *
 * For mobile devices we have a separate "MobileFilterDialog"
 * component.
 */
const FilterDialog: React.FC = () => {
	useRenderLogging("FilterDialog");

	const modalProps = useFilterDialogModalProps();
	return (
		<Modal {...modalProps}>
			<ModalOverlay />
			<ModalContent>
				<ModalBody>
					<VStack spacing="group" width="full">
						<BigFilterInterface
							property="carriedByCharacterId"
							heading="Carried By"
							hideIfEmpty
						/>
						<BigFilterInterface
							property="category"
							heading="Category"
							hideIfEmpty
						/>
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
