import {
	selectCharacterBeingEdited,
	useInventoryStore,
	useInventoryStoreDispatch,
} from "$sheets/store";
import {
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	HStack,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useUpdateEffect,
} from "@chakra-ui/react";
import { characterSchema } from "prisma/schemas/character";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { flow } from "@mobily/ts-belt";
import CharacterConfirmDeleteDialog from "$sheets/components/Dialogs/CharacterConfirmDeleteDialog";
import { useForm } from "$hook-form";
import { createSchemaKeyHelperFunction } from "$root/utils";

const characterDialogFormSchema = characterSchema.pick({
	name: true,
	carryCapacity: true,
});

const f = createSchemaKeyHelperFunction(characterDialogFormSchema);

const useCharacterDialogModalProps = () =>
	useInventoryStore((s) => ({
		isOpen: s.ui.characterDialog.mode !== "closed",
		onClose: () => s.dispatch({ type: "ui.close-character-dialog" }),
	}));

const useCharacterDialogFieldInitialValues = (): z.infer<
	typeof characterDialogFormSchema
> =>
	useInventoryStore((s) => {
		const characterBeingEdited = selectCharacterBeingEdited(s);

		return {
			name: characterBeingEdited?.name ?? "",
			carryCapacity: characterBeingEdited?.carryCapacity ?? 0,
		};
	});

const useCharacterDialogTitle = () =>
	useInventoryStore(
		flow(selectCharacterBeingEdited, (s) => s?.name ?? "Create Character")
	);

const formResolver = zodResolver(characterDialogFormSchema);

/**
 *
 */
const CharacterDialog = () => {
	const dispatch = useInventoryStoreDispatch();

	const { isOpen, onClose } = useCharacterDialogModalProps();
	const defaultValues = useCharacterDialogFieldInitialValues();
	const header = useCharacterDialogTitle();
	const dialogState = useInventoryStore((s) => s.ui.characterDialog);

	const { register, handleSubmit, reset, formState } = useForm({
		defaultValues,
		resolver: formResolver,
	});

	const onSubmit = handleSubmit((data) => {
		if (dialogState.mode === "new-character") {
			dispatch({
				type: "add-character",
				payload: data,
			});
		}
		if (dialogState.mode === "edit") {
			dispatch({
				type: "update-character",
				payload: {
					characterId: dialogState.data.characterId,
					data,
				},
			});
		}
		dispatch({ type: "ui.close-character-dialog" });
	});

	useUpdateEffect(() => {
		// Whenever the modal is opened, set form values to the default values
		reset(defaultValues);
	}, [isOpen]);

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent as="form" onSubmit={onSubmit}>
					<ModalHeader>{header}</ModalHeader>
					<ModalCloseButton />

					<ModalBody>
						<FormControl isInvalid={!!formState.errors.name}>
							<FormLabel htmlFor={f("name")}>Name</FormLabel>
							<Input id={f("name")} {...register("name")} />
							<FormErrorMessage>
								{formState.errors.name && formState.errors.name.message}
							</FormErrorMessage>
						</FormControl>
					</ModalBody>

					<ModalFooter justifyContent="space-between">
						<HStack>
							<Button
								colorScheme="gray"
								variant="ghost"
								onClick={() =>
									dispatch({
										type: "ui.close-character-dialog",
									})
								}
							>
								Cancel
							</Button>

							{/* Delete Button */}
							{dialogState.mode === "edit" && (
								<Button
									colorScheme="red"
									variant="ghost"
									onClick={() =>
										dispatch({
											type: "ui.handle-character-delete-button",
										})
									}
								>
									Delete
								</Button>
							)}
						</HStack>
						<Button type="submit" colorScheme="primary">
							Save
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			<CharacterConfirmDeleteDialog />
		</>
	);
};

export default CharacterDialog;
