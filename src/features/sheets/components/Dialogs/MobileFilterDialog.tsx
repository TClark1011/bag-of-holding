import { useIsMobile, useRenderLogging } from "$root/hooks";
import BigFilterInterface from "$sheets/components/BigFilterInterface";
import {
	InventoryStoreProps,
	composeSelectItemPropertyFilterHasValues,
	useInventoryStore,
	useInventoryStoreDispatch,
} from "$sheets/store";
import {
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	VStack,
} from "@chakra-ui/react";
import { FC } from "react";

const selectFilterDialogIsOpen = (state: InventoryStoreProps) =>
	state.ui.filterDialogIsOpen;

const MobileFilterDialog: FC = () => {
	useRenderLogging("MobileFilterDialog");

	const dispatch = useInventoryStoreDispatch();
	const isMobile = useIsMobile();

	const isOpen = useInventoryStore(selectFilterDialogIsOpen);
	const onClose = () =>
		dispatch({
			type: "ui.close-filter-dialog",
		});

	const carriedByHasFilterValues = useInventoryStore(
		composeSelectItemPropertyFilterHasValues("carriedByCharacterId")
	);
	const categoryHasFilterValues = useInventoryStore(
		composeSelectItemPropertyFilterHasValues("category")
	);

	return (
		<Drawer isOpen={isOpen && isMobile} onClose={onClose} placement="bottom">
			<DrawerOverlay />
			<DrawerContent h="60vh">
				<DrawerCloseButton />

				<DrawerHeader>Filters</DrawerHeader>
				<DrawerBody>
					<VStack spacing="group">
						{carriedByHasFilterValues && (
							<BigFilterInterface
								property="carriedByCharacterId"
								heading="Carried By"
							/>
						)}
						{categoryHasFilterValues && (
							<BigFilterInterface property="category" heading="Category" />
						)}
					</VStack>
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};

export default MobileFilterDialog;
