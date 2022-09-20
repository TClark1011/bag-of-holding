import {
	Button,
	IconButton,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Divider,
	Flex,
	Text,
	VStack,
	ModalBody,
	ModalFooter,
	Input,
	useDisclosure,
	Radio,
	RadioGroup,
	RadioGroupProps,
	RadioProps,
	chakra,
	ComponentWithAs,
} from "@chakra-ui/react";
import { Field, FieldArray, Formik, FormikHelpers } from "formik";
import { InputControl } from "formik-chakra-ui";
import { RemoveIcon } from "chakra-ui-ionicons";
import { useState } from "react";
import { SheetDialog, ItemGiveToSelect } from "$sheets/components";
import {
	DeleteCharacterItemHandlingMethods,
	CharacterDeleteMethodFields,
	FullSheet,
} from "$sheets/types";
import {
	useInventoryState,
	useInventoryStateDispatch,
} from "$sheets/providers";
import { useSheetPageState } from "$sheets/store";
import { sheetOptionsValidation } from "$sheets/validation";
import { defaultFieldLength } from "$root/constants";
import { generateCharacter } from "$sheets/utils";
import { ConfirmationDialog, Paragraph } from "$root/components";

export type SheetOptionsDialogFormFields = Pick<
	FullSheet,
	"name" | "characters"
>;

const CharacterDeleteMethodRadio = chakra<
	ComponentWithAs<"input">,
	Omit<RadioProps, "value"> & {
		value: CharacterDeleteMethodFields["mode"];
	}
>(Radio);
//? A copy of the 'Radio' component from Chakra UI with it's `value` prop typed to `InventoryCharacterDeleteMethodFields["mode"]`

type CharacterDeleteMethodRadioGroupProps = Omit<
	RadioGroupProps,
	"value" | "onChange"
> & {
	value: CharacterDeleteMethodFields["mode"];
	onChange: (val: CharacterDeleteMethodFields["mode"]) => void;
};

const CharacterDeleteMethodRadioGroup = chakra<
	ComponentWithAs<"div", CharacterDeleteMethodRadioGroupProps>,
	CharacterDeleteMethodRadioGroupProps
>(RadioGroup);
//? A copy of the 'RadioGroup' component from Chakra UI with it's typing changed

/**
 * Component for sheet settings dialog
 *
 * @returns The rendered component
 */
const SheetOptionsDialog: React.FC = () => {
	const { name, characters } = useInventoryState();
	const dispatch = useInventoryStateDispatch();

	const {
		closeDialog,
		sheetCharactersQueue,
		queueCharacterForAdd,
		queueCharacterForRemove,
		selectedSheetCharacterRemoveMethod,
		selectNewSheetCharacterRemoveMethod,
		selectedSheetCharacterRemovedMoveToCharacter,
	} = useSheetPageState();

	/**
	 * Handle submission of formik form
	 *
	 * @param data The form data
	 * @param formikHelpers Object with functions for
	 * controlling formik
	 * @param formikHelpers.setSubmitting  Set whether
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
				characters: {
					add: data.characters.filter((dataCharacter) =>
						sheetCharactersQueue.add.includes(dataCharacter.id)
					),
					remove: sheetCharactersQueue.remove,
					update: data.characters.filter((dataCharacter) => {
						const matchingExistingCharacter = characters.find(
							(item) => item.id === dataCharacter.id
						);
						return (
							matchingExistingCharacter &&
							matchingExistingCharacter.name !== dataCharacter.name
						);
						//? We get items that already existed as characters in the sheet before this dialog was opened but have had their name changed
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
		isOpen: deleteCharacterConfirmIsOpen,
		onOpen: deleteCharacterConfirmOnOpen,
		onClose: deleteCharacterConfirmOnClose,
	} = useDisclosure();

	const [deleteCharacterTarget, setDeleteCharacterTarget] = useState<{
		name: string;
		index: number;
		id: string;
	}>({ name: "", index: 0, id: "" });

	return (
		<SheetDialog dialogType="sheetOptions" header="Sheet Options">
			<Formik
				onSubmit={onSubmit}
				initialValues={{ name, characters }}
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
							{/* //# Character fields */}
							<Text fontWeight="bold" textAlign="center">
								Characters
							</Text>
							<Divider />
							<VStack spacing="group">
								<FieldArray name="characters">
									{(helpers) => (
										<>
											{values.characters.map((item, index) => (
												<Field
													name={"characters." + index + ".name"}
													key={index}
												>
													{({ field, form }) => (
														<FormControl
															isInvalid={
																form.errors.characters &&
																form.touched.characters &&
																form.errors.characters[index] &&
																form.touched.characters[index]
															}
														>
															<FormLabel>Character {index + 1}</FormLabel>
															<Flex>
																<Input
																	{...field}
																	marginRight="group"
																	maxLength={defaultFieldLength}
																/>
																<IconButton
																	colorScheme="error"
																	onClick={() => {
																		deleteCharacterConfirmOnOpen();
																		setDeleteCharacterTarget({
																			id: item.id,
																			name: item.name,
																			index,
																		});
																	}}
																	aria-label={"delete character " + (index + 1)}
																	icon={<RemoveIcon />}
																	borderRadius="full"
																	variant="outline"
																/>
															</Flex>
															<FormErrorMessage>
																{form.errors.characters &&
																	form.errors.characters[index] &&
																	form.errors.characters[index].name}
															</FormErrorMessage>
														</FormControl>
													)}
												</Field>
											))}
											{/* //# Add new character button */}
											<Button
												width="full"
												size="sm"
												colorScheme="secondary"
												onClick={() => {
													const newCharacter = generateCharacter("");
													helpers.push(newCharacter);
													queueCharacterForAdd(newCharacter.id);
												}}
											>
												Add Party Member
											</Button>
											{/* //# Character Delete Confirmation */}
											<ConfirmationDialog
												isOpen={deleteCharacterConfirmIsOpen}
												onCancel={deleteCharacterConfirmOnClose}
												header={`Remove "${deleteCharacterTarget.name}" from sheet?`}
												onConfirm={() => {
													queueCharacterForRemove(
														values.characters[deleteCharacterTarget.index].id,
														{
															mode: selectedSheetCharacterRemoveMethod,
															...(selectedSheetCharacterRemoveMethod ===
																DeleteCharacterItemHandlingMethods.give && {
																to: selectedSheetCharacterRemovedMoveToCharacter,
															}),
														}
													);
													helpers.remove(deleteCharacterTarget.index);
												}}
											>
												<Paragraph>
													Are you sure you want to delete this party character
													from the sheet?
												</Paragraph>
												<Paragraph>
													What should happen to items being carried by{" "}
													{deleteCharacterTarget.name}?
												</Paragraph>
												<CharacterDeleteMethodRadioGroup
													value={selectedSheetCharacterRemoveMethod}
													onChange={(val) =>
														selectNewSheetCharacterRemoveMethod(val)
													}
												>
													<VStack align="start" spacing={4}>
														{/* //# "Give To" method */}
														{characters.length -
															sheetCharactersQueue.remove.length >
															1 && (
															// ? Do not show "give to" option if there are no other characters in the sheet that can receive items
															// NOTE: Cannot currently move items to a character that was just created
															<Flex justify="space-between" width="full">
																<CharacterDeleteMethodRadio
																	value={
																		DeleteCharacterItemHandlingMethods.give
																	}
																>
																	<Flex align="center" marginRight={2}>
																		Give To
																	</Flex>
																</CharacterDeleteMethodRadio>
																{/* //# "Give To" character Select */}
																<ItemGiveToSelect
																	removingCharacterId={deleteCharacterTarget.id}
																	flexGrow={1}
																	width="max-content"
																	size="sm"
																/>
															</Flex>
														)}
														<CharacterDeleteMethodRadio
															value={DeleteCharacterItemHandlingMethods.delete}
														>
															Delete From Sheet
														</CharacterDeleteMethodRadio>
														<CharacterDeleteMethodRadio
															value={
																DeleteCharacterItemHandlingMethods.setToNobody
															}
														>
															Set {"\"Carried By\""} to {"\"Nobody\""}
														</CharacterDeleteMethodRadio>
													</VStack>
												</CharacterDeleteMethodRadioGroup>
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
