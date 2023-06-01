import {
	Modal,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	ModalProps,
} from "@chakra-ui/react";

export type DialogProps = ModalProps & {
	header?: React.ReactChild;
	noOverlay?: boolean;
	noCloseButton?: boolean;
};

/**
 * Component for easily composing Dialogs by making use of the
 * 'Modal' component
 *
 * @param props The props
 * @param [props.header] The element to use
 * as the header
 * @param [props.noOverlay=false] If true, a
 * 'ModalOverlay' is not used
 * @param [props.noCloseButton=false] If true, no
 * 'ModalCloseButton' is included
 * @param [props.children] The children
 * @returns The component stuff
 */
const Dialog: React.FC<DialogProps> = ({
	header,
	noOverlay = false,
	noCloseButton = false,
	children,
	...props
}) => (
	<Modal {...props}>
		{!noOverlay && <ModalOverlay />}
		<ModalContent marginBottom={32} data-testid="dialog-content">
			{/* //? Extra Margin Bottom to stop bottom action buttons being covered by safari navigation bar */}
			{header && <ModalHeader>{header}</ModalHeader>}
			{!noCloseButton && <ModalCloseButton />}
			{children}
		</ModalContent>
	</Modal>
);

export default Dialog;
