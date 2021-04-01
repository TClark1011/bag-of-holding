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

	//TODO: Field Validation
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
																	onClick={() => helpers.remove(index)}
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
