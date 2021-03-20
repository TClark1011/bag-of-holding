import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { SimpleGrid, VStack } from "@chakra-ui/layout";
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
import DialogControlProps from "../../types/DialogControlProps";
import InventoryItemFields, {
	InventoryItemCreationFields,
} from "../../types/InventoryItemFields";
import InventoryStateAction from "../../types/InventoryStateAction";
import FormItem from "../ui/FormItem";
import NumberField from "../ui/NumberField";

/**
 * Modal dialog for creating a new item
 *
 * @param {object} props props
 * @param {UseDisclosureReturn} props.controller Object with methods for controlling
 * the state of the dialog
 * @returns {React.ReactElement} The rendered HTML
 */
const NewItemDialog: React.FC<DialogControlProps> = ({
	controller: { onClose, isOpen },
}) => {
	const initialFormValues: InventoryItemCreationFields = {
		name: "",
		quantity: 1,
		value: 0,
		weight: 0,
		description: "",
		category: "",
		reference: "",
	};

	/**
	 * @param data
	 */
	const onSubmit = (data: InventoryItemCreationFields) => {
		console.log("Submitting Data");
		console.log("(NewItemDialog) data: ", data);
		const action: InventoryStateAction = {
			type: "item_add",
			data,
		};
		fetch("http://localhost:3000/api/1", {
			method: "PATCH",
			body: JSON.stringify(action),
		}).then(() => console.log("finished submitting data"));
	};
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<Formik initialValues={initialFormValues} onSubmit={onSubmit}>
				{({ handleSubmit }) => (
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
										<FormItem label="Category">
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
							<Button colorScheme="secondary" onClick={() => handleSubmit()}>
								Create Item
							</Button>
						</ModalFooter>
					</ModalContent>
				)}
			</Formik>
		</Modal>
	);
};

export default NewItemDialog;
