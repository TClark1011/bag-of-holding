import {
	fromSheet,
	fromUI,
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
import {
	useCharacterCreateMutation,
	useCharacterUpdateMutation,
} from "$sheets/hooks";
import { get } from "$fp";

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

const useCharacterDialogForm = () => {
	const { isOpen } = useCharacterDialogModalProps();

	const defaultValues = useCharacterDialogFieldInitialValues();

	const { reset, ...form } = useForm({
		defaultValues,
		resolver: formResolver,
	});

	useUpdateEffect(() => {
		// Whenever the modal is opened, set form values to the default values
		reset(defaultValues);
	}, [isOpen]);

	return { reset, ...form };
};

/**
 * Dialog for creating/editing/deleting characters
 */
const CharacterDialog = () => {
	const dispatch = useInventoryStoreDispatch();

	const { isOpen, onClose } = useCharacterDialogModalProps();
	const header = useCharacterDialogTitle();
	const sheetId = useInventoryStore(fromSheet(get("id")));
	const dialogState = useInventoryStore(fromUI(get("characterDialog")));

	const { register, handleSubmit, formState } = useCharacterDialogForm();

	const characterCreationMutator = useCharacterCreateMutation();
	const characterUpdateMutator = useCharacterUpdateMutation();

	const onSubmit = handleSubmit(async (data) => {
		if (dialogState.mode === "new-character") {
			await characterCreationMutator.mutateAsync({
				...data,
				sheetId,
			});
		}
		if (dialogState.mode === "edit") {
			await characterUpdateMutator.mutateAsync({
				characterId: dialogState.data.characterId,
				data,
			});
		}
		dispatch({ type: "ui.close-character-dialog" });
	});

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent
					as="form"
					data-testid="dialog-content"
					onSubmit={onSubmit}
				>
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
						<Button
							type="submit"
							colorScheme="primary"
							isLoading={formState.isSubmitting}
						>
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
