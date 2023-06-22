import { useRenderLogging } from "$root/hooks";
import { useItemDeleteMutation } from "$sheets/hooks";
import {
	standaloneItemDeleteConfirmDialogAtom,
	useNullableIdTargetingDialogAtom,
	useOptionalItemWithId,
} from "$sheets/store";
import {
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/react";
import { FC } from "react";

const StandaloneDeleteItemConfirmationDialog: FC = () => {
	useRenderLogging("StandaloneDeleteItemConfirmationDialog");

	const {
		onClose,
		isOpen,
		targetId: idOfItemBeingDeleted,
	} = useNullableIdTargetingDialogAtom(standaloneItemDeleteConfirmDialogAtom);
	const itemBeingDeleted = useOptionalItemWithId(idOfItemBeingDeleted ?? "");

	const deleteItemMutation = useItemDeleteMutation({
		onSuccess: onClose,
	});

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Delete &quot;{itemBeingDeleted?.name}&quot;?</ModalHeader>
				<ModalCloseButton />
				<ModalBody>Are you sure?</ModalBody>
				<ModalFooter>
					<Button onClick={onClose} mr={3} variant="ghost">
						Cancel
					</Button>
					<Button
						onClick={() =>
							deleteItemMutation.mutate({
								itemId: idOfItemBeingDeleted ?? "",
							})
						}
						colorScheme="red"
						isLoading={deleteItemMutation.isLoading}
					>
						Delete
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default StandaloneDeleteItemConfirmationDialog;
