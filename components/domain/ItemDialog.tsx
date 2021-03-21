import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Flex, SimpleGrid, VStack } from "@chakra-ui/layout";
import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/modal";
import { Select } from "@chakra-ui/select";
import { Textarea } from "@chakra-ui/textarea";
import { Field, Formik } from "formik";
import { useState } from "react";
import DialogControlProps from "../../types/DialogControlProps";
import { InventoryItemCreationFields } from "../../types/InventoryItemFields";
import { InventorySheetStateAction } from "../../types/InventorySheetState";
import { useSheetStateDispatch } from "../contexts/SheetStateContext";
import FormItem from "../ui/FormItem";
import NumberField from "../ui/NumberField";

export type ItemDialogMode = "edit" | "new";

interface Props extends DialogControlProps {
	mode: ItemDialogMode;
	item?: InventoryItemCreationFields;
}

/**
 * Modal dialog for creating a new item
 *
 * @param {object} props props
 * @param {UseDisclosureReturn} props.controller Object with methods for controlling
 * the state of the dialog
 * @param props.mode
 * @param props.item
 * @returns {React.ReactElement} The rendered HTML
 */
const ItemDialog: React.FC<Props> = ({
	controller: { onClose, isOpen },
	mode,
	item,
}) => {
	const inEditMode = mode === "edit";

	const initialFormValues: InventoryItemCreationFields =
		inEditMode && item
			? item
			: {
				name: "",
				quantity: 1,
				value: 0,
				weight: 0,
				description: "",
				category: "",
				reference: "",
			  };

	const dispatch = useSheetStateDispatch();

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
		console.log("Submitting Data");
		console.log("(ItemDialog) data: ", data);
		const action: InventorySheetStateAction = {
			type: "item_add",
			data,
			sendToServer: true,
			/**
			 * Set submitting to false when the server responds
			 */
			onFinally: () => {
				setSubmitting(false);
			},
			/**
			 * Close the dialog if the server responded positively
			 */
			onThen: () => {
				onClose();
			},
		};
		dispatch(action);
	};

	const [isDeleting, setIsDeleting] = useState<boolean>(false);

	/**
	 * @param item
	 * @param itemId
	 * @param setSubmitting
	 */
	const getOnDeleteClick = (): void => {
		setIsDeleting(true);
		dispatch({
			type: "item_remove",
			data: item._id,
			sendToServer: true,
			/**
			 * Regardless of result, mark submission as complete at end of query
			 */
			onFinally: () => {
				setIsDeleting(false);
			},
			/**
			 * Close Dialog if delete request was successful
			 */
			onThen: () => {
				onClose();
			},
		});
	};

	//TODO Handle form validation errors
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<Formik initialValues={initialFormValues} onSubmit={onSubmit}>
				{({ handleSubmit, isSubmitting }) => (
					<ModalContent>
						<ModalHeader>Add New Item</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<VStack spacing="group">
								<Field name="name">
									{({ field }) => (
										<FormItem label="Name" isRequired>
											<Input placeholder="Item name" {...field} />
										</FormItem>
									)}
								</Field>
								<Field name="category">
									{({ field }) => (
										<FormItem label="Category">
											<Input
												placeholder="eg; 'Weapon' or 'Survival'"
												{...field}
											/>
										</FormItem>
									)}
								</Field>
								<Field name="description">
									{({ field }) => (
										<FormItem label="Description">
											<Textarea placeholder="Item description" {...field} />
										</FormItem>
									)}
								</Field>
								<SimpleGrid columns={3} spacing="group">
									<FormItem label="Quantity">
										<Field name="quantity">
											{({ field }) => <NumberField {...field} />}
										</Field>
									</FormItem>
									<FormItem label="Weight">
										<Field name="weight">
											{({ field }) => <NumberField {...field} />}
										</Field>
									</FormItem>
									<FormItem label="Value">
										<Field name="value">
											{({ field }) => <NumberField {...field} />}
										</Field>
									</FormItem>
									{/* FIXME: Number Inputs do not work */}
								</SimpleGrid>
								<FormItem label="Carried By">
									<Select>
										<option value="">Select Item</option>
										<option>Vincent</option>
									</Select>
								</FormItem>
								{/* TODO: Pass in members to this component somehow to insert them here as options */}
								<Field name="reference">
									{({ field }) => (
										<FormItem label="Reference">
											<Input
												placeholder="Link to more information"
												{...field}
											/>
										</FormItem>
									)}
								</Field>
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
										onClick={getOnDeleteClick}
										isLoading={isDeleting}
									>
										Delete
									</Button>
								)}
								<Button
									colorScheme="secondary"
									onClick={() => handleSubmit()}
									isLoading={isSubmitting}
								>
									Create Item
								</Button>
							</Flex>
						</ModalFooter>
					</ModalContent>
				)}
			</Formik>
		</Modal>
	);
};

export default ItemDialog;
