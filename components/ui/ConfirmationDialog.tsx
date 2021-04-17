import { Button } from "@chakra-ui/button";
import { ModalFooter } from "@chakra-ui/modal";
import React from "react";
import Dialog, { DialogProps } from "./Dialog";

type CustomDialogProps = Omit<DialogProps, "children" | "onClose">;

export interface ConfirmationDialogProps extends CustomDialogProps {
	onConfirm: () => void;
	onCancel: () => void;
	confirmLabel?: string;
	cancelLabel?: string;
}

/**
 * A dialog for requiring user confirmation before
 * executing an action.
 * Example: Deleting an item should require user
 * confirmation
 *
 * @param {object} props The props
 * @param {Function} props.onConfirm Function to
 * execute if the user clicks the confirm button
 * @param {Function} props.onCancel Function to
 * execute if the user clicks the cancel button
 * @param {string} [props.confirmLabel="Confirm"]
 * The label to use for the confirm button.
 * @param {string} [props.cancelLabel="Cancel"]
 * The label to use for the cancel button.
 * @returns {React.ReactElement} Rendered stuff
 */
const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
	onConfirm,
	onCancel,
	confirmLabel = "Confirm",
	cancelLabel = "Cancel",
	...props
}) => {
	return (
		<Dialog {...props} onClose={onCancel}>
			<ModalFooter>
				<Button colorScheme={"error"} onClick={onCancel}>
					{cancelLabel}
				</Button>
				<Button colorScheme={"primary"} onClick={onConfirm}>
					{confirmLabel}
				</Button>
			</ModalFooter>
		</Dialog>
	);
};

export default ConfirmationDialog;
