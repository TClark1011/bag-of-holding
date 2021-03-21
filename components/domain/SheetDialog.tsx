import { Button } from "@chakra-ui/button";
import { Flex, VStack } from "@chakra-ui/layout";
import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/modal";
import { Formik, FormikHelpers } from "formik";
import { InputControl } from "formik-chakra-ui";
import DialogControlProps from "../../types/DialogControlProps";
import InventorySheetFields from "../../types/InventorySheetFields";
import {
	useSheetState,
	useSheetStateDispatch,
} from "../contexts/SheetStateContext";

/**
 * @param root0
 * @param root0.controller
 */
const SheetDialog: React.FC<DialogControlProps> = ({ controller }) => {
	const { name } = useSheetState();
	const dispatch = useSheetStateDispatch();
	/**
	 * @param root0
	 * @param root0.setSubmitting
	 * @param data
	 * @param root0.setSubmitting.setSubmitting
	 * @param data.setSubmitting
	 */
	const onSubmit = (
		data,
		{ setSubmitting }: FormikHelpers<Pick<InventorySheetFields, "name">>
	) => {
		setSubmitting(true);
		console.log("(SheetDialog) data: ", data);
		dispatch({
			type: "sheet_update",
			data,
			sendToServer: true,
			/**
			 * Close dialog on success
			 */
			onThen: () => {
				controller.onClose();
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
	return (
		<Modal {...controller}>
			<ModalOverlay />
			<Formik onSubmit={onSubmit} initialValues={{ name }}>
				{({ handleSubmit, isSubmitting }) => (
					<ModalContent>
						<ModalHeader>SheetOptions</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<VStack spacing="group">
								<InputControl name="name" label="Name" />
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
					</ModalContent>
				)}
			</Formik>
		</Modal>
	);
};

export default SheetDialog;
