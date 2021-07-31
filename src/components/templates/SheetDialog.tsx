import { SheetDialogType, useSheetPageState } from "../../state/sheetPageState";
import Dialog, { DialogProps } from "../ui/Dialog";

type SpecialDialogProps = Omit<DialogProps, "onClose" | "isOpen">;
//? I do this because if I do the interface extending + Omit on one line then prettier forces a linebreak and the auto indentation looks horrid

export interface SheetDialogProps extends SpecialDialogProps {
	dialogType: SheetDialogType;
}

/**
 * Template component for quickly composing Dialogs
 * containing information related to Sheet data
 *
 * @param props
 * The props
 * @param props.dialogType The
 * dialog type
 * @returns Component stuff
 */
const SheetDialog: React.FC<SheetDialogProps> = ({ dialogType, ...props }) => {
	const { isDialogOpen, closeDialog } = useSheetPageState();
	return (
		<Dialog
			{...props}
			isOpen={isDialogOpen(dialogType)}
			onClose={closeDialog}
		/>
	);
};

export default SheetDialog;
