import {
	selectSheetName,
	useInventoryStore,
	useInventoryStoreDispatch,
} from "$sheets/store";
import {
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect } from "react";
import { z } from "zod";
import { sheetSchema } from "@prisma/schemas";
import { useForm } from "$hook-form";
import { createSchemaKeyHelperFunction } from "$root/utils";
import { useSheetNameChangeMutation } from "$sheets/hooks";

const sheetNameFormSchema = sheetSchema.pick({
	name: true,
});

const f = createSchemaKeyHelperFunction(sheetNameFormSchema);

const sheetNameFormResolver = zodResolver(sheetNameFormSchema);

const useModalProps = () => {
	const dispatch = useInventoryStoreDispatch();
	const onClose = () => dispatch({ type: "ui.close-sheet-name-dialog" });

	const isOpen = useInventoryStore((s) => s.ui.sheetNameDialogIsOpen, []);

	return { isOpen, onClose };
};

const useSheetNameForm = () => {
	const { isOpen } = useModalProps();
	const name = useInventoryStore(selectSheetName, []);
	const form = useForm<z.infer<typeof sheetNameFormSchema>>({
		resolver: sheetNameFormResolver,
		defaultValues: {
			name,
		},
	});

	useEffect(() => {
		form.reset({
			name,
		});
	}, [name, isOpen]);

	return form;
};

const useSubmitHandler = () => {
	const sheetId = useInventoryStore((s) => s.sheet.id, []);
	const { onClose } = useModalProps();

	const sheetRenameMutation = useSheetNameChangeMutation();

	const onSubmit = async ({ name }: z.infer<typeof sheetNameFormSchema>) => {
		await sheetRenameMutation.mutateAsync({
			sheetId,
			newName: name,
		});
		onClose();
	};

	return onSubmit;
};

/**
 * The modal for editing a sheets name
 */
const SheetNameDialog: FC = () => {
	const modalProps = useModalProps();
	const { formState, register, handleSubmit } = useSheetNameForm();
	const onSubmit = useSubmitHandler();

	return (
		<Modal {...modalProps}>
			<ModalOverlay />
			<ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
				<ModalHeader>Edit Sheet Name</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<FormControl isInvalid={!!formState.errors.name}>
						<FormLabel htmlFor={f("name")}>Sheet Name</FormLabel>
						<Input id={f("name")} {...register("name")}></Input>
						<FormErrorMessage>
							{formState.errors.name && formState.errors.name.message}
						</FormErrorMessage>
					</FormControl>
				</ModalBody>
				<ModalFooter justifyContent="space-between">
					<Button onClick={modalProps.onClose} variant="ghost">
						Cancel
					</Button>
					<Button
						type="submit"
						colorScheme="primary"
						isDisabled={!formState.isValid}
						isLoading={formState.isSubmitting}
					>
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default SheetNameDialog;
