import {
	characterBeingEditedAtom,
	characterDeleteConfirmationDialogIsOpenAtom,
	characterDialogAtom,
	fromSheet,
	useInventoryStore,
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
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	useUpdateEffect,
} from "@chakra-ui/react";
import { characterSchema } from "prisma/schemas/character";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CharacterConfirmDeleteDialog from "$sheets/components/Dialogs/CharacterConfirmDeleteDialog";
import { Controller, useForm } from "$hook-form";
import { createSchemaKeyHelperFunction } from "$root/utils";
import {
	useCharacterCreateMutation,
	useCharacterUpdateMutation,
} from "$sheets/hooks";
import { get } from "$fp";
import { useEntityTiedDialogAtom } from "$sheets/utils";
import { useAtomValue } from "jotai";
import { useDisclosureAtom } from "$jotai-helpers";
import { useRenderLogging } from "$root/hooks";

const characterDialogFormSchema = characterSchema.pick({
	name: true,
	money: true,
});

const f = createSchemaKeyHelperFunction(characterDialogFormSchema);

const useCharacterDialogFieldInitialValues = (): z.infer<
	typeof characterDialogFormSchema
> => {
	const characterBeingEdited = useAtomValue(characterBeingEditedAtom);

	return {
		name: characterBeingEdited?.name ?? "",
		money: characterBeingEdited?.money ?? 0,
	};
};

const useCharacterDialogTitle = () => {
	const characterBeingEdited = useAtomValue(characterBeingEditedAtom);

	return characterBeingEdited?.name ?? "Create Character";
};

const formResolver = zodResolver(characterDialogFormSchema);

const useCharacterDialogForm = () => {
	const { isOpen } = useEntityTiedDialogAtom(characterDialogAtom);

	const defaultValues = useCharacterDialogFieldInitialValues();

	const { reset, ...form } = useForm({
		defaultValues,
		resolver: formResolver,
	});

	useUpdateEffect(() => {
		if (isOpen) {
			// Whenever the modal is opened, set form values to the default values
			reset(defaultValues);
		}
	}, [isOpen]);

	return { reset, ...form };
};

/**
 * Dialog for creating/editing/deleting characters
 */
const CharacterDialog = () => {
	useRenderLogging("CharacterDialog");

	const header = useCharacterDialogTitle();
	const sheetId = useInventoryStore(fromSheet(get("id")), []);
	const {
		isOpen,
		isInEditMode,
		onClose,
		value: rawDialogState,
	} = useEntityTiedDialogAtom(characterDialogAtom);

	const { register, handleSubmit, formState, control } =
		useCharacterDialogForm();

	const characterCreationMutator = useCharacterCreateMutation();
	const characterUpdateMutator = useCharacterUpdateMutation();

	const onSubmit = handleSubmit(async (data) => {
		if (!isInEditMode) {
			await characterCreationMutator.mutateAsync({
				sheetId,
				...data,
			});
		}
		if (isInEditMode && rawDialogState) {
			await characterUpdateMutator.mutateAsync({
				characterId: rawDialogState, // Will be character id when in edit mode
				data,
			});
		}
		onClose();
	});

	const { onOpen: openDeleteConfirmationDialog } = useDisclosureAtom(
		characterDeleteConfirmationDialogIsOpenAtom
	);

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose} size="xs">
				<ModalOverlay />
				<ModalContent
					as="form"
					data-testid="dialog-content"
					onSubmit={onSubmit}
				>
					<ModalHeader>{header}</ModalHeader>
					<ModalCloseButton />

					<ModalBody>
						<FormControl isInvalid={!!formState.errors.name} mb="group">
							<FormLabel htmlFor={f("name")}>Name</FormLabel>
							<Input id={f("name")} {...register("name")} />
							<FormErrorMessage>
								{formState.errors.name && formState.errors.name.message}
							</FormErrorMessage>
						</FormControl>

						<FormControl isInvalid={!!formState.errors.money}>
							<FormLabel htmlFor={f("money")}>Money</FormLabel>
							<Controller
								name="money"
								control={control}
								render={({ field: { ref, onChange, ...restField } }) => (
									<NumberInput
										{...(restField as any)}
										onChange={(e) => onChange(Number(e))}
										min={0}
									>
										<NumberInputField
											id="money"
											ref={ref}
											name={restField.name}
										/>
										<NumberInputStepper>
											<NumberIncrementStepper />
											<NumberDecrementStepper />
										</NumberInputStepper>
									</NumberInput>
								)}
							></Controller>
							<FormErrorMessage>
								{formState.errors.name && formState.errors.name.message}
							</FormErrorMessage>
						</FormControl>
					</ModalBody>

					<ModalFooter justifyContent="space-between">
						<HStack>
							<Button colorScheme="gray" variant="ghost" onClick={onClose}>
								Cancel
							</Button>

							{/* Delete Button */}
							{isInEditMode && (
								<Button
									colorScheme="red"
									variant="ghost"
									onClick={openDeleteConfirmationDialog}
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
