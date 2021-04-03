import { Button } from "@chakra-ui/button";
import { Box, Flex, List, SimpleGrid, VStack } from "@chakra-ui/layout";
import { ModalBody, ModalFooter } from "@chakra-ui/modal";
import codeToTitle from "code-to-title";
import { Formik } from "formik";
import {
	InputControl,
	NumberInputControl,
	SelectControl,
	TextareaControl,
} from "formik-chakra-ui";
import {
	SheetDialogType,
	useSheetPageState,
} from "../../../../state/sheetPageState";
import { InventoryItemCreationFields } from "../../../../types/InventoryItemFields";
import { InventorySheetStateAction } from "../../../../types/InventorySheetState";
import {
	useInventoryState,
	useInventoryStateDispatch,
} from "../../../contexts/InventoryStateContext";
import SheetDialog from "../../../templates/SheetDialog";
import faker from "faker";
import itemValidation, {
	descriptionLength,
	referenceLength,
} from "../../../../validation/itemValidation";
import { defaultFieldLength } from "../../../../constants/validationConstants";
import { useMemo } from "react";

export type ItemDialogMode = "edit" | "new";

interface Props {
	mode: ItemDialogMode;
}

/**
 * Modal dialog for creating a new item
 *
 * @param {object} props props
 * @param {ItemDialogMode} props.mode The mode the dialog is in. Eg; "new" if being used to
 * create a new item or "edit" if being used to edit an existing item.
 * @returns {React.ReactElement} The rendered HTML
 */
const ItemDialog: React.FC<Props> = ({ mode }) => {
	const inEditMode = mode === "edit";

	const { activeItem, closeDialog, getUniqueCategories } = useSheetPageState();

	const initialFormValues: InventoryItemCreationFields = inEditMode
		? activeItem
		: {
			_id: faker.datatype.uuid(),
			name: "",
			quantity: 1,
			value: 0,
			weight: 0,
			description: "",
			category: "None",
			reference: "",
			carriedBy: "Nobody",
		  };

	const dispatch = useInventoryStateDispatch();

	const { members, items } = useInventoryState();

	const categoryAutocompleteItems = useMemo(() => getUniqueCategories(items), [
		items,
	]);

	/**
	 * Handle the submitting of the new item form
	 * Sends data in a 'PATCH' http request to the api.
	 *
	 * @param {InventoryItemCreationFields} data The form data
	 * @param {object} formFunctions Object containing functions for controlling
	 * formik behaviour
	 * @param {Function} formFunctions.setSubmitting Set whether or not the form is
	 * currently submitting
	 */
	const onSubmit = (data: InventoryItemCreationFields, { setSubmitting }) => {
		const action: InventorySheetStateAction = {
			type: inEditMode ? "item_update" : "item_add",
			data,
			sendToServer: true,
			/**
			 * Close the dialog if the server responded positively
			 */
			onThen: () => {
				closeDialog();
			},
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
	 * @param {Function} setSubmitting Function set the
	 * 'isSubmitting' status of the form
	 */
	const onDelete = (setSubmitting: (a: boolean) => void): void => {
		setSubmitting(true);
		dispatch({
			type: "item_remove",
			data: activeItem._id,
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

	const headingPrefix = mode === "new" ? "Create" : codeToTitle(mode);
	return (
		<SheetDialog
			dialogType={("item." + mode) as SheetDialogType}
			header={`${headingPrefix} Item`}
		>
			<Formik
				initialValues={initialFormValues}
				onSubmit={onSubmit}
				validationSchema={itemValidation}
			>
				{({ handleSubmit, isSubmitting, setSubmitting, values }) => (
					<>
						<ModalBody>
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
									{categoryAutocompleteItems.map((item) => (
										<option value={item} key={item} />
									))}
								</datalist>
								<Box>
									<List>
										{categoryAutocompleteItems.filter((item) =>
											item.includes(values.category)
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
								<SelectControl name="carriedBy" label="Carried By">
									<option value="Nobody">Nobody</option>
									{members.map((item, index) => (
										<option value={item} key={index}>
											{item}
										</option>
									))}
								</SelectControl>
								<InputControl
									name="reference"
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
										onClick={() => onDelete(setSubmitting)}
										isDisabled={isSubmitting}
									>
										Delete
									</Button>
								)}
								<Button
									colorScheme="primary"
									onClick={() => handleSubmit()}
									isLoading={isSubmitting}
								>
									{inEditMode ? "Save" : "Create Item"}
								</Button>
							</Flex>
						</ModalFooter>
					</>
				)}
			</Formik>
		</SheetDialog>
	);
};

export default ItemDialog;
