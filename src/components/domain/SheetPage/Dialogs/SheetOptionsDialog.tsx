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
import generateMember from "../../../../generators/generateMember";
import blockProdBuild from "../../../../utils/blockProdBuild";

blockProdBuild(
	"Fix validation sheet options dialog with the new inventory member objects"
);
blockProdBuild("Convert old sheets to use new member object structure");
blockProdBuild("Update existing party members");
blockProdBuild("Add fallback value for 'PartyMemberData' component");

export type SheetOptionsDialogFormFields = Pick<
	InventorySheetFields,
	"name" | "members"
>;

/**
 * Component for sheet settings dialog
 *
 * @returns {React.ReactElement} The rendered component
 */
const SheetOptionsDialog: React.FC = () => {
	const { name, members } = useInventoryState();
	const dispatch = useInventoryStateDispatch();

	const {
		closeDialog,
		sheetMembersQueue,
		queueMemberForAdd,
		queueMemberForRemove,
	} = useSheetPageState();

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
		data: SheetOptionsDialogFormFields,
		{ setSubmitting }: FormikHelpers<SheetOptionsDialogFormFields>
	) => {
		console.log("(SheetOptionsDialog) data: ", data);
		setSubmitting(true);
		dispatch({
			type: "sheet_metadataUpdate",
			data: {
				name: data.name,
				members: {
					add: data.members.filter((dataMember) =>
						sheetMembersQueue.add.includes(dataMember._id)
					),
					remove: sheetMembersQueue.remove,
					update: data.members.filter((dataMember) => {
						const matchingExistingMember = members.find(
							(item) => item._id === dataMember._id
						);
						return (
							matchingExistingMember &&
							matchingExistingMember.name !== dataMember.name
						);
						//? We get items that already existed as members in the sheet before this dialog was opened but have had their name changed
					}),
				},
			},
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
							{/* {sheetMembersQueue.remove.length && (
								<>Member is going to be deleted</>
							)} */}
							{/* //# Member fields */}
							<Text fontWeight="bold" textAlign="center">
								Members
							</Text>
							<Divider />
							<VStack spacing="group">
								<FieldArray name="members">
									{(helpers) => (
										<>
											{values.members.map((item, index) => (
												<Field name={"members." + index + ".name"} key={index}>
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
																			name: item.name,
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
											{/* //# Add new member button */}
											<Button
												width="full"
												size="sm"
												colorScheme="secondary"
												onClick={() => {
													const newMember = generateMember("");
													helpers.push(newMember);
													queueMemberForAdd(newMember._id);
												}}
											>
												Add Party Member
											</Button>
											{/* //# Member Delete Confirmation */}
											<ConfirmationDialog
												isOpen={deleteMemberConfirmIsOpen}
												onCancel={deleteMemberConfirmOnClose}
												header={`Remove "${deleteMemberTarget.name}" from sheet?`}
												onConfirm={() => {
													queueMemberForRemove(
														values.members[deleteMemberTarget.index]._id,
														{
															mode: "remove",
														}
													);
													helpers.remove(deleteMemberTarget.index);
												}}
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
