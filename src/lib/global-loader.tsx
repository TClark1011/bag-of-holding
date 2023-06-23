import {
	Modal,
	ModalContent,
	ModalOverlay,
	Spinner,
	Text,
} from "@chakra-ui/react";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { FC, useEffect } from "react";

const isGlobalLoadingAtom = atom(false);
const globalLoadingMessageAtom = atom<string | undefined>(undefined);

/**
 * To use this, just call `useGlobalLoading` in your component,
 * passing in a boolean for whether or not the global loader should
 * be shown and an optional message to display.
 */
export const useGlobalLoading = (isLoading: boolean, message?: string) => {
	const setIsLoading = useSetAtom(isGlobalLoadingAtom);
	const setMessage = useSetAtom(globalLoadingMessageAtom);

	useEffect(() => {
		setIsLoading(isLoading);
		setMessage(message);
	}, [isLoading, message, setIsLoading, setMessage]);

	useEffect(() => {
		return () => {
			setIsLoading(false);
			setMessage(undefined);
		};
	}, [setIsLoading, setMessage]);
};

/**
 * Place this in your `_app.tsx` file
 */
export const GlobalLoader: FC = () => {
	const isLoading = useAtomValue(isGlobalLoadingAtom);
	const message = useAtomValue(globalLoadingMessageAtom);

	return (
		<Modal
			isOpen={isLoading}
			onClose={() => {}}
			closeOnOverlayClick={false}
			isCentered
			autoFocus={false}
		>
			<ModalOverlay />
			<ModalContent
				bg="transparent"
				border="none"
				display="flex"
				flexDirection="column"
				alignItems="center"
			>
				<Spinner
					size="xl"
					emptyColor="gray.200"
					color="primary.500"
					thickness="4px"
				/>
				{message && (
					<Text fontWeight="bold" mt="group">
						{message}
					</Text>
				)}
			</ModalContent>
		</Modal>
	);
};
