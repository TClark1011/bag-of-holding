import { useDisappearingHashAtom } from "$jotai-hash-disappear-atom";
import { useIsMobile, useRenderLogging } from "$root/hooks";
import BigFilterInterface from "$sheets/components/BigFilterInterface";
import { filterDialogIsOpenAtom } from "$sheets/store";
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

const MobileFilterDialog: FC = () => {
	useRenderLogging("MobileFilterDialog");

	const isMobile = useIsMobile();

	const [isOpen, setIsOpen] = useDisappearingHashAtom(filterDialogIsOpenAtom);
	const onClose = () => setIsOpen(false);

	return (
		<Drawer isOpen={isOpen && isMobile} onClose={onClose} placement="bottom">
			<DrawerOverlay />
			<DrawerContent h="60vh">
				<DrawerCloseButton />

				<DrawerHeader>Filters</DrawerHeader>
				<DrawerBody>
					<VStack spacing="group">
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
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};

export default MobileFilterDialog;
