import {
	ModalBody,
	useUpdateEffect,
	Modal,
	ModalOverlay,
	ModalHeader,
	ModalCloseButton,
	ModalContent,
	FormControl,
	FormLabel,
	FormErrorMessage,
	Input,
	Textarea,
	Flex,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
	VStack,
	Select,
	Button,
	ModalFooter,
	useDisclosure,
} from "@chakra-ui/react";
import {
	InventoryStoreSelector,
	itemBeingEditedAtom,
	itemDialogAtom,
	selectCharacters,
	useInventoryStore,
} from "$sheets/store";
import { A, D, flow, G } from "@mobily/ts-belt";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSchemaKeyHelperFunction, _getUniqueValuesOf } from "$root/utils";
import { z } from "zod";
import { useForm } from "$hook-form";
import { IterableElement } from "type-fest";
import useRenderLogging from "$root/hooks/useRenderLogging";
import {
	useAddItemMutation,
	useEditItemMutation,
	useItemDeleteMutation,
	useSheetPageId,
} from "$sheets/hooks";
import { itemSchema } from "prisma/schemas/item";
import { useEntityTiedDialogAtom } from "$sheets/utils";
import { useAtomValue } from "jotai";
import { useEffect } from "react";

const itemFormSchema = itemSchema.omit({ id: true, sheetId: true });
const itemFormResolver = zodResolver(itemFormSchema);
const f = createSchemaKeyHelperFunction(itemFormSchema);

const useItemFormInitialValues = (): z.infer<typeof itemFormSchema> => {
	const itemBeingEdited = useAtomValue(itemBeingEditedAtom);

	return (
		itemBeingEdited ?? {
			name: "",
			value: 0,
			weight: 0,
			quantity: 1,
		}
	);
};

const useItemForm = () => {
	const defaultValues = useItemFormInitialValues();
	const { isOpen } = useEntityTiedDialogAtom(itemDialogAtom);
	const { reset, ...form } = useForm<z.infer<typeof itemFormSchema>>({
		resolver: itemFormResolver,
		defaultValues,
	});

	useUpdateEffect(() => {
		reset(defaultValues);
	}, [isOpen]);

	return { reset, ...form };
};

const selectAllItemCategories: InventoryStoreSelector<string[]> = flow(
	D.getUnsafe("sheet"),
	D.getUnsafe("items"),
	_getUniqueValuesOf(D.getUnsafe("category")),
	A.filter(G.isString)
);

const CATEGORY_LIST_NAME = "existing-categories";

const NUMERIC_FIELDS = [f("quantity"), f("weight"), f("value")] as const;

const NUMERIC_FIELD_LABELS: Record<
	IterableElement<typeof NUMERIC_FIELDS>,
	string
> = {
	quantity: "Quantity",
	weight: "Weight",
	value: "Value",
};

/**
 * Modal dialog for creating a new item
 *
 * @param props props
 * @param props.mode The mode the dialog is in. Eg; "new" if being used to
 * create a new item or "edit" if being used to edit an existing item.
 * @returns The rendered HTML
 */
const ItemDialog: React.FC = () => {
	useRenderLogging("ItemDialog");

	const createItemMutator = useAddItemMutation();
	const editItemMutator = useEditItemMutation();
	const deleteItemMutator = useItemDeleteMutation();
	const sheetId = useSheetPageId();
	const { formState, register, handleSubmit } = useItemForm();
	const existingItemCategories = useInventoryStore(selectAllItemCategories, []);
	const characters = useInventoryStore(selectCharacters, []);
	const { isInEditMode, isOpen, onClose } =
		useEntityTiedDialogAtom(itemDialogAtom);
	const itemBeingEdited = useAtomValue(itemBeingEditedAtom);

	const deleteConfirmationModalController = useDisclosure();

	useEffect(() => {
		if (!isOpen && deleteConfirmationModalController.isOpen) {
			deleteConfirmationModalController.onClose();
		}
	}, [isOpen, deleteConfirmationModalController]);

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent
					as="form"
					onSubmit={handleSubmit(async (form) => {
						if (isInEditMode && itemBeingEdited) {
							await editItemMutator.mutateAsync({
								itemId: itemBeingEdited.id,
								data: form,
							});
						} else if (!isInEditMode) {
							await createItemMutator.mutateAsync({
								...form,
								sheetId,
							});
						}
						onClose();
					})}
				>
					<ModalHeader>
						{isInEditMode ? "Edit Item" : "Create Item"}
					</ModalHeader>
					<ModalCloseButton />

					<ModalBody>
						<VStack>
							{/* Name */}
							<FormControl isInvalid={!!formState.errors.name}>
								<FormLabel htmlFor={f("name")}>Name</FormLabel>
								<Input
									id={f("name")}
									{...register("name")}
									placeholder="Name"
								/>
								<FormErrorMessage>
									{formState.errors.name && formState.errors.name.message}
								</FormErrorMessage>
							</FormControl>
							{/* Category */}
							<FormControl isInvalid={!!formState.errors.category}>
								<FormLabel htmlFor={f("category")}>Category</FormLabel>
								<Input
									id={f("category")}
									{...register("category")}
									placeholder="Category"
									list={CATEGORY_LIST_NAME}
								/>
								<datalist id={CATEGORY_LIST_NAME}>
									{existingItemCategories.map((category) => (
										<option value={category} key={category} />
									))}
								</datalist>
								<FormErrorMessage>
									{formState.errors.category &&
										formState.errors.category.message}
								</FormErrorMessage>
							</FormControl>
							{/* Description */}
							<FormControl isInvalid={!!formState.errors.description}>
								<FormLabel htmlFor={f("description")}>Description</FormLabel>
								<Textarea
									id={f("description")}
									{...register("description")}
									placeholder="Description"
								/>
								<FormErrorMessage>
									{formState.errors.description &&
										formState.errors.description.message}
								</FormErrorMessage>
							</FormControl>
							{/* Quantity/Weight/Value */}
							<Flex justify="space-between" gap="group">
								{NUMERIC_FIELDS.map((fieldName) => (
									<FormControl
										key={fieldName}
										isInvalid={!!formState.errors[fieldName]}
									>
										<FormLabel htmlFor={fieldName}>
											{NUMERIC_FIELD_LABELS[fieldName]}
										</FormLabel>
										<NumberInput
											step={fieldName === "quantity" ? 1 : 0.25}
											min={0}
										>
											<NumberInputField
												id={fieldName}
												{...register(fieldName, {
													valueAsNumber: true,
												})}
											/>
											<NumberInputStepper>
												<NumberIncrementStepper />
												<NumberDecrementStepper />
											</NumberInputStepper>
										</NumberInput>
										<FormErrorMessage>
											{formState.errors[fieldName] &&
												formState.errors[fieldName]?.message}
										</FormErrorMessage>
									</FormControl>
								))}
							</Flex>

							{/* Carried By */}
							<FormControl isInvalid={!!formState.errors.carriedByCharacterId}>
								<FormLabel htmlFor={f("carriedByCharacterId")}>
									Carried By
								</FormLabel>
								<Select
									id={f("carriedByCharacterId")}
									{...register("carriedByCharacterId", {
										setValueAs: (value: string) =>
											value === "" ? null : value,
									})}
								>
									<option value="">Nobody</option>
									{characters.map((character) => (
										<option value={character.id} key={character.id}>
											{character.name}
										</option>
									))}
								</Select>
								<FormErrorMessage>
									{formState.errors.carriedByCharacterId &&
										formState.errors.carriedByCharacterId.message}
								</FormErrorMessage>
							</FormControl>

							{/* Reference */}
							<FormControl isInvalid={!!formState.errors.referenceLink}>
								<FormLabel htmlFor={f("referenceLink")}>Reference</FormLabel>
								<Input
									id={f("referenceLink")}
									{...register("referenceLink")}
									placeholder="Reference"
								/>
								<FormErrorMessage>
									{formState.errors.referenceLink &&
										formState.errors.referenceLink.message}
								</FormErrorMessage>
							</FormControl>
						</VStack>
						{/* Footer */}
					</ModalBody>
					<ModalFooter
						gap={2}
						justifyContent={isInEditMode ? "space-between" : "flex-end"}
					>
						{isInEditMode && (
							<Button
								variant="ghost"
								colorScheme="red"
								onClick={deleteConfirmationModalController.onOpen}
							>
								Delete
							</Button>
						)}
						<Flex gap={2}>
							<Button variant="ghost" onClick={onClose}>
								Cancel
							</Button>
							<Button
								type="submit"
								colorScheme="primary"
								isLoading={
									editItemMutator.isLoading || createItemMutator.isLoading
								}
							>
								{isInEditMode ? "Save" : "Create"}
							</Button>
						</Flex>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* Delete Confirmation Modal */}
			<Modal {...deleteConfirmationModalController}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Confirm Delete</ModalHeader>
					<ModalBody>
						Are you sure you want to delete the item &quot;
						{itemBeingEdited?.name}
						&quot;?
					</ModalBody>
					<ModalFooter gap={2}>
						<Button
							variant="ghost"
							onClick={deleteConfirmationModalController.onClose}
						>
							Cancel
						</Button>
						<Button
							isLoading={deleteItemMutator.isLoading}
							onClick={() => {
								deleteItemMutator
									.mutateAsync({
										itemId: itemBeingEdited?.id ?? "",
									})
									.then(
										flow(deleteConfirmationModalController.onClose, onClose)
									);
							}}
						>
							Confirm
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ItemDialog;
