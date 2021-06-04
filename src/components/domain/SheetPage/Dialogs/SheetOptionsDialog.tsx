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
import generateMember from "../../../../utils/generateMember";
import {
	Radio,
	RadioGroup,
	RadioGroupProps,
	RadioProps,
} from "@chakra-ui/radio";
import {
	InventoryMemberDeleteMethodFields,
	DeleteMemberItemHandlingMethods,
} from "../../../../types/InventorySheetState";
import { chakra, ComponentWithAs } from "@chakra-ui/system";
import ItemGiveToSelect from "../ItemGiveToSelect";

export type SheetOptionsDialogFormFields = Pick<
	InventorySheetFields,
	"name" | "members"
>;

const MemberDeleteMethodRadio = chakra<
	ComponentWithAs<"input">,
	Omit<RadioProps, "value"> & {
		value: InventoryMemberDeleteMethodFields["mode"];
	}
>(Radio);
//? A copy of the 'Radio' component from Chakra UI with it's `value` prop typed to `InventoryMemberDeleteMethodFields["mode"]`

type MemberDeleteMethodRadioGroupProps = Omit<
	RadioGroupProps,
	"value" | "onChange"
> & {
	value: InventoryMemberDeleteMethodFields["mode"];
	onChange: (val: InventoryMemberDeleteMethodFields["mode"]) => void;
};

const MemberDeleteMethodRadioGroup = chakra<
	ComponentWithAs<"div", MemberDeleteMethodRadioGroupProps>,
	MemberDeleteMethodRadioGroupProps
>(RadioGroup);
//? A copy of the 'RadioGroup' component from Chakra UI with it's typing changed

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
		selectedSheetMemberRemoveMethod,
		selectNewSheetMemberRemoveMethod,
		selectedSheetMemberRemovedMoveToMember,
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
		_id: string;
	}>({ name: "", index: 0, _id: "" });

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
																			_id: item._id,
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
																	form.errors.members[index] &&
																	form.errors.members[index].name}
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
															mode: selectedSheetMemberRemoveMethod,
															...(selectedSheetMemberRemoveMethod ===
																DeleteMemberItemHandlingMethods.give && {
																to: selectedSheetMemberRemovedMoveToMember,
															}),
														}
													);
													helpers.remove(deleteMemberTarget.index);
												}}
											>
												<Paragraph>
													Are you sure you want to delete this party member from
													the sheet?
												</Paragraph>
												<Paragraph>
													What should happen to items being carried by{" "}
													{deleteMemberTarget.name}?
												</Paragraph>
												<MemberDeleteMethodRadioGroup
													value={selectedSheetMemberRemoveMethod}
													onChange={(val) =>
														selectNewSheetMemberRemoveMethod(val)
													}
												>
													<VStack align="start" spacing={4}>
														{/* //# "Give To" method */}
														{members.length - sheetMembersQueue.remove.length >
															1 && (
															// ? Do not show "give to" option if there are no other members in the sheet that can receive items
															// NOTE: Cannot currently move items to a character that was just created
															<Flex justify="space-between" width="full">
																<MemberDeleteMethodRadio
																	value={DeleteMemberItemHandlingMethods.give}
																>
																	<Flex align="center" marginRight={2}>
																		Give To
																	</Flex>
																</MemberDeleteMethodRadio>
																{/* //# "Give To" member Select */}
																<ItemGiveToSelect
																	removingMemberId={deleteMemberTarget._id}
																	flexGrow={1}
																	width="max-content"
																	size="sm"
																/>
															</Flex>
														)}
														<MemberDeleteMethodRadio
															value={DeleteMemberItemHandlingMethods.delete}
														>
															Delete From Sheet
														</MemberDeleteMethodRadio>
														<MemberDeleteMethodRadio
															value={
																DeleteMemberItemHandlingMethods.setToNobody
															}
														>
															Set {"\"Carried By\""} to {"\"Nobody\""}
														</MemberDeleteMethodRadio>
													</VStack>
												</MemberDeleteMethodRadioGroup>
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
