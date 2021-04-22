import { Button, IconButton } from "@chakra-ui/button";
import {
	FormControl,
	FormErrorMessage,
	FormLabel,
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Divider, Flex, Text, VStack } from "@chakra-ui/layout";
import { ModalBody, ModalFooter } from "@chakra-ui/modal";
import { Field, FieldArray, Formik, FormikHelpers } from "formik";
import { InputControl } from "formik-chakra-ui";
import InventorySheetFields from "../../../../types/InventorySheetFields";
import {
	useInventoryState,
	useInventoryStateDispatch,
} from "../../../contexts/InventoryStateContext";
import { RemoveIcon } from "chakra-ui-ionicons";
import { useSheetPageState } from "../../../../state/sheetPageState";
import SheetDialog from "../../../templates/SheetDialog";
import sheetOptionsValidation from "../../../../validation/sheetOptionsValidation";
import { defaultFieldLength } from "../../../../constants/validationConstants";
import { useDisclosure } from "@chakra-ui/hooks";
import ConfirmationDialog from "../../../ui/ConfirmationDialog";
import { useState } from "react";
import { Paragraph } from "../../../ui/Typography";

/**
 * Component for sheet settings dialog
 *
 * @returns {React.ReactElement} The rendered component
 */
const SheetOptionsDialog: React.FC = () => {
	const { name, members } = useInventoryState();
	const dispatch = useInventoryStateDispatch();

	const { closeDialog } = useSheetPageState();

	/**
	 * Handle submission of formik form
	 *
	 * @param {object} data The form data
	 * @param {object} formikHelpers Object with functions for
	 * controlling formik
	 * @param {Function} formikHelpers.setSubmitting  Set whether
	 * or not the form is currently submitting
	 * */
	const onSubmit = (
		data,
		{
			setSubmitting,
		}: FormikHelpers<Pick<InventorySheetFields, "name" | "members">>
	) => {
		setSubmitting(true);
		console.log("(SheetDialog) data: ", data);
		dispatch({
			type: "sheet_metadataUpdate",
			data,
			sendToServer: true,
			/**
			 * Close dialog on success
			 */
			onThen: () => {
				closeDialog();
			},
			/**
			 *	Set submitting to false at end of request regardless of results
			 */
			onFinally: () => {
				setSubmitting(false);
			},
		});
	};

	const {
		isOpen: deleteMemberConfirmIsOpen,
		onOpen: deleteMemberConfirmOnOpen,
		onClose: deleteMemberConfirmOnClose,
	} = useDisclosure();

	const [deleteMemberTarget, setDeleteMemberTarget] = useState<{
		name: string;
		index: number;
	}>({ name: "", index: 0 });

	///TODO: Confirmation when deleting a member
	return (
		<SheetDialog dialogType="sheetOptions" header="Sheet Options">
			<Formik
				onSubmit={onSubmit}
				initialValues={{ name, members }}
				validationSchema={sheetOptionsValidation}
			>
				{({ handleSubmit, isSubmitting, values }) => (
					<>
						<ModalBody>
							<InputControl
								name="name"
								label="Name"
								marginBottom="break"
								inputProps={{ maxLength: defaultFieldLength }}
							/>
							<Text fontWeight="bold" textAlign="center">
								Members
							</Text>
							<Divider />
							<VStack spacing="group">
								<FieldArray name="members">
									{(helpers) => (
										<>
											{values.members.map((item, index) => (
												<Field name={"members." + index} key={index}>
													{({ field, form }) => (
														<FormControl
															name={"members." + index}
															isInvalid={
																form.errors.members &&
																form.touched.members &&
																form.errors.members[index] &&
																form.touched.members[index]
															}
														>
															<FormLabel>Member {index + 1}</FormLabel>
															<Flex>
																<Input
																	{...field}
																	marginRight="group"
																	maxLength={defaultFieldLength}
																/>
																<IconButton
																	colorScheme="error"
																	onClick={() => {
																		deleteMemberConfirmOnOpen();
																		setDeleteMemberTarget({
																			name: item,
																			index,
																		});
																	}}
																	aria-label={"delete member " + (index + 1)}
																	icon={<RemoveIcon />}
																	borderRadius="full"
																	variant="outline"
																/>
															</Flex>
															<FormErrorMessage>
																{form.errors.members &&
																	form.errors.members[index]}
															</FormErrorMessage>
														</FormControl>
													)}
												</Field>
											))}
											<Button
												width="full"
												size="sm"
												colorScheme="secondary"
												onClick={() => {
													helpers.push("");
												}}
											>
												Add Party Member
											</Button>
											<ConfirmationDialog
												isOpen={deleteMemberConfirmIsOpen}
												onCancel={deleteMemberConfirmOnClose}
												onConfirm={() =>
													helpers.remove(deleteMemberTarget.index)
												}
												header={`Remove "${deleteMemberTarget.name}" from sheet?`}
											>
												<Paragraph>
													Are you sure you want to remove this party member?
												</Paragraph>
												<Paragraph marginBottom={0}>
													<Text fontWeight="bold" as="span">
														NOTE:
													</Text>{" "}
													Any items they are carrying will still be registered
													as being carried by them. Any items they are currently
													carrying must be edited manually.
												</Paragraph>
											</ConfirmationDialog>
										</>
									)}
								</FieldArray>
							</VStack>
						</ModalBody>
						<ModalFooter>
							<Flex justify="flex-end">
								<Button
									colorScheme="primary"
									onClick={() => handleSubmit()}
									isLoading={isSubmitting}
								>
									Save
								</Button>
							</Flex>
						</ModalFooter>
					</>
				)}
			</Formik>
		</SheetDialog>
	);
};

export default SheetOptionsDialog;
