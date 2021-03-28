import { Button, IconButton } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Divider, Flex, Text, VStack } from "@chakra-ui/layout";
import { ModalBody, ModalFooter } from "@chakra-ui/modal";
import { Field, FieldArray, Formik, FormikHelpers } from "formik";
import { InputControl } from "formik-chakra-ui";
import InventorySheetFields from "../../types/InventorySheetFields";
import {
	useInventoryState,
	useInventoryStateDispatch,
} from "../contexts/InventoryStateContext";
import { RemoveIcon } from "chakra-ui-ionicons";
import { useSheetPageState } from "../../state/sheetPageState";
import SheetDialog from "../templates/SheetDialog";

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
			<Formik onSubmit={onSubmit} initialValues={{ name, members }}>
				{({ handleSubmit, isSubmitting, values }) => (
					<>
						<ModalBody>
							<InputControl
								name="name"
								label="Name"
								inputProps={{ marginBottom: "break" }}
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
												<Flex key={index} width="full" alignItems="flex-end">
													<Field name={"members." + index}>
														{({ field }) => (
															<>
																<FormControl
																	name={"members." + index}
																	paddingRight="group"
																>
																	<FormLabel>Member {index + 1}</FormLabel>
																	<Input {...field} />
																</FormControl>
															</>
														)}
													</Field>
													<IconButton
														colorScheme="error"
														onClick={() => helpers.remove(index)}
														aria-label={"delete member " + (index + 1)}
														icon={<RemoveIcon />}
														borderRadius="full"
														variant="outline"
													/>
												</Flex>
											))}
											<Button
												width="full"
												size="sm"
												colorScheme="primary"
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
									colorScheme="secondary"
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
