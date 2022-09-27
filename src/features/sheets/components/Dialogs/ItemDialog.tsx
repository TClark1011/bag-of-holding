import {
	Button,
	Box,
	Flex,
	List,
	SimpleGrid,
	VStack,
	ModalBody,
	ModalFooter,
	useDisclosure,
} from "@chakra-ui/react";
import { Formik } from "formik";
import {
	InputControl,
	NumberInputControl,
	SelectControl,
	TextareaControl,
} from "formik-chakra-ui";
import { SheetDialogType, useSheetPageState } from "$sheets/store";
import { SheetStateAction, ItemCreationFields } from "$sheets/types";
import {
	useInventoryState,
	useInventoryStateDispatch,
} from "$sheets/providers";
import { SheetDialog } from "$sheets/components";
import {
	itemValidation,
	descriptionLength,
	referenceLength,
} from "$sheets/validation";
import { defaultFieldLength } from "$root/constants";
import { useMemo } from "react";
import { ConfirmationDialog } from "$root/components";
import { toFormikValidationSchema } from "zod-formik-adapter";
import stringifyObject from "stringify-object";
import { G } from "@mobily/ts-belt";

export type ItemDialogMode = "edit" | "new";

interface Props {
	mode: ItemDialogMode;
}

const validator = toFormikValidationSchema(itemValidation);

/**
 * Modal dialog for creating a new item
 *
 * @param props props
 * @param props.mode The mode the dialog is in. Eg; "new" if being used to
 * create a new item or "edit" if being used to edit an existing item.
 * @returns The rendered HTML
 */
const ItemDialog: React.FC<Props> = ({ mode }) => {
	const inEditMode = mode === "edit";

	const { activeItem, closeDialog, getUniqueCategories } = useSheetPageState();

	const initialFormValues: Omit<
		ItemCreationFields,
		"id" | "sheetId"
	> = inEditMode
		? activeItem
		: {
			name: "",
			quantity: 1,
			value: 0,
			weight: 0,
			carriedByCharacterId: null,
			category: null,
			description: null,
			referenceLink: null,
		  };

	const dispatch = useInventoryStateDispatch();
	const { characters, items } = useInventoryState();

	const categoryAutocompleteItems = useMemo(() => getUniqueCategories(items), [
		items,
	]);

	const {
		isOpen: deleteConfirmIsOpen,
		onOpen: deleteConfirmOnOpen,
		onClose: deleteConfirmOnClose,
	} = useDisclosure();

	/**
	 * Handle the submitting of the new item form
	 * Sends data in a 'PATCH' http request to the api.
	 *
	 * @param data The form data
	 * @param formFunctions Object containing functions for controlling
	 * formik behaviour
	 * @param formFunctions.setSubmitting Set whether or not the form is
	 * currently submitting
	 */
	const onSubmit = (data: ItemCreationFields, { setSubmitting }: any) => {
		if (!data.category) {
			data.category = "None";
		}

		const action: SheetStateAction = {
			type: inEditMode ? "item_update" : "item_add",
			data: {
				id: data.id ?? "",
				...data,
			},
			sendToServer: true,
			/**
			 * Close the dialog if the server responded positively
			 */
			onThen: closeDialog,
			/**
			 * Set submitting to false when the server responds
			 */
			onFinally: () => {
				setSubmitting(false);
			},
		};
		dispatch(action);
	};

	/**
	 * Function to execute when delete button is clicked
	 *
	 * @param setSubmitting Function set the
	 * 'isSubmitting' status of the form
	 */
	const onDelete = (setSubmitting: (a: boolean) => void): void => {
		setSubmitting(true);
		dispatch({
			type: "item_remove",
			data: activeItem.id,
			sendToServer: true,
			/**
			 * Regardless of result, mark submission as complete at end of query
			 */
			onFinally: () => {
				setSubmitting(false);
			},
			/**
			 * Close Dialog if delete request was successful
			 */
			onThen: () => {
				closeDialog();
			},
		});
	};

	const headingPrefix = inEditMode ? "Edit" : "Create";
	return (
		<SheetDialog
			dialogType={("item." + mode) as SheetDialogType}
			header={`${headingPrefix} Item`}
		>
			<Formik
				initialValues={initialFormValues as never}
				onSubmit={onSubmit}
				validationSchema={validator}
			>
				{({ handleSubmit, isSubmitting, setSubmitting, values, errors }) => (
					<>
						<ModalBody>
							<p style={{ color: "red" }}>{stringifyObject(errors)}</p>
							<VStack spacing="group">
								<InputControl
									name="name"
									label="Name"
									inputProps={{
										placeholder: "Name",
										maxLength: defaultFieldLength,
									}}
								/>
								<InputControl
									name="category"
									label="Category"
									inputProps={{
										placeholder: "eg; 'Weapon' or 'Survival'",
										maxLength: defaultFieldLength,
										list: "test",
										autoComplete: "off",
									}}
								/>
								<datalist id="test">
									{categoryAutocompleteItems.filter(G.isString).map((item) => (
										<option value={item} key={item} />
									))}
								</datalist>
								<Box>
									<List>
										{categoryAutocompleteItems.filter((item) =>
											item?.includes(values.category as never)
										)}
									</List>
								</Box>
								<TextareaControl
									name="description"
									label="Description"
									textareaProps={{
										placeholder: "Description of the item",
										maxLength: descriptionLength,
									}}
								/>
								<SimpleGrid columns={3} spacing="group">
									<NumberInputControl
										name="quantity"
										label="Quantity"
										numberInputProps={{ min: 1 }}
									/>
									<NumberInputControl
										name="weight"
										label="Weight"
										numberInputProps={{ min: 0 }}
									/>
									<NumberInputControl
										name="value"
										label="Value"
										numberInputProps={{ min: 0 }}
									/>
								</SimpleGrid>
								<SelectControl name="carriedByCharacterId" label="Carried By">
									<option value="Nobody">Nobody</option>
									{characters.map((member) => (
										<option value={member.id} key={member.id}>
											{member.name}
										</option>
									))}
								</SelectControl>
								<InputControl
									name="referenceLink"
									label="Reference"
									inputProps={{
										placeholder: "Link to more information",
										maxLength: referenceLength,
									}}
								/>
							</VStack>
						</ModalBody>
						<ModalFooter>
							<Flex
								justify={inEditMode ? "space-between" : "flex-end"}
								width="full"
							>
								{inEditMode && (
									<Button
										colorScheme="error"
										// onClick={() => onDelete(setSubmitting)}
										onClick={deleteConfirmOnOpen}
										isDisabled={isSubmitting}
									>
										Delete
									</Button>
								)}
								<Button colorScheme="primary" onClick={() => handleSubmit()}>
									{inEditMode ? "Save" : "Create Item"}
								</Button>
							</Flex>
						</ModalFooter>
						<ConfirmationDialog
							isOpen={deleteConfirmIsOpen}
							onConfirm={() => onDelete(setSubmitting)}
							onCancel={deleteConfirmOnClose}
							confirmProps={{ isLoading: isSubmitting }}
							header={`Delete "${activeItem.name}" ?`}
						>
							Are you sure you want to delete this item?{" "}
							{activeItem.quantity > 1 && (
								<>
									All
									{activeItem.quantity} instanceof it will be removed from the
									sheet.
								</>
							)}
						</ConfirmationDialog>
					</>
				)}
			</Formik>
		</SheetDialog>
	);
};

export default ItemDialog;
