import { expectParam, P } from "$fp";
import { useDisclosureAtom } from "$jotai-helpers";
import { useOnMountEffect, useRenderLogging } from "$root/hooks";
import { useCharacterDeleteMutation } from "$sheets/hooks";
import {
	characterBeingEditedAtom,
	characterDeleteConfirmationDialogIsOpenAtom,
	characterDialogAtom,
	itemsCarriedByCharacterBeingEditedAtom,
	selectCharacters,
	useInventoryStore,
} from "$sheets/store";
import {
	characterRemovalItemDeleteStrategySchema,
	characterRemovalItemPassStrategySchema,
	characterRemovalItemToNobodyStrategySchema,
	CharacterRemovalStrategy,
} from "$sheets/types";
import { useEntityTiedDialogAtom } from "$sheets/utils";
import {
	Button,
	Flex,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Radio,
	RadioGroup,
	Select,
	Text,
	useBoolean,
	VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { A, F, flow } from "@mobily/ts-belt";
import { useAtomValue } from "jotai";
import { FC, useCallback, useEffect, useMemo } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";

/* #region  Form Stuff */
const characterDeletionNameSchema = z.union([
	characterRemovalItemPassStrategySchema.shape.type,
	characterRemovalItemToNobodyStrategySchema.shape.type,
	characterRemovalItemDeleteStrategySchema.shape.type,
]);

const strategySelectionFormSchema = z.object({
	strategyType: characterDeletionNameSchema,
	passToTarget: z.string().nullable(),
});

type StrategySelectionFormFields = z.infer<typeof strategySelectionFormSchema>;

const strategySelectionFormResolver = zodResolver(strategySelectionFormSchema);

const dsf = expectParam<keyof StrategySelectionFormFields>(); //dsf - deletion strategy form
const dsn = expectParam<CharacterRemovalStrategy["type"]>(); // dsn - deletion strategy name
/* #endregion */

const useStrategySelectionForm = () =>
	useForm<StrategySelectionFormFields>({
		resolver: strategySelectionFormResolver,
		defaultValues: {
			strategyType: "item-pass",
			passToTarget: null,
		},
	});

const StrategySelectionForm: FC<{
	form: UseFormReturn<StrategySelectionFormFields>;
}> = ({ form: { register, setValue, getValues } }) => {
	const otherCharacters = useOtherCharacters();

	useOnMountEffect(() => {
		setValue("passToTarget", otherCharacters[0]?.id ?? null);
	});
	return (
		<RadioGroup
			name={dsf("strategyType")}
			defaultValue={getValues("strategyType")}
			w="full"
		>
			<VStack alignItems="flex-start" spacing="break">
				{A.isNotEmpty(otherCharacters) && (
					<Flex w="100%">
						<Radio
							{...register("strategyType")}
							value={dsn("item-pass")}
							w="max-content"
							mr="group"
						>
							Give To
						</Radio>
						<Select {...register("passToTarget")} size="sm" flex={1}>
							{otherCharacters.map((character) => (
								<option key={character.id} value={character.id}>
									{character.name}
								</option>
							))}
						</Select>
					</Flex>
				)}
				<Radio {...register("strategyType")} value={dsn("item-delete")}>
					Delete From Sheet
				</Radio>
				<Radio {...register("strategyType")} value={dsn("item-to-nobody")}>
					Set {'"Carried To"'} to {'"Nobody"'}
				</Radio>
			</VStack>
		</RadioGroup>
	);
};

/* #region  Scoped Hooks */

const useOtherCharacters = () => {
	const characterBeingEdited = useAtomValue(characterBeingEditedAtom);
	return useInventoryStore((state) => {
		const characters = selectCharacters(state);

		return A.reject(characters, (c) => c.id === characterBeingEdited?.id);
	}, []);
};

const useHandleCharacterDeletionWithStrategyForm = () => {
	const characterBeingEdited = useAtomValue(characterBeingEditedAtom);
	const characterDeletionMutation = useCharacterDeleteMutation();

	const handler = useCallback(
		async (data: StrategySelectionFormFields) => {
			const characterId = characterBeingEdited?.id ?? "";
			if (data.strategyType === "item-pass") {
				await characterDeletionMutation.mutateAsync({
					characterId,
					strategy: {
						type: data.strategyType,
						data: {
							toCharacterId: data.passToTarget ?? "",
						},
					},
				});
			} else {
				await characterDeletionMutation.mutateAsync({
					characterId,
					strategy: {
						type: data.strategyType,
					},
				});
			}
		},
		[characterBeingEdited, characterDeletionMutation]
	);

	return handler;
};

const useHandleConfirmationWithItemDeleteStrategy = () => {
	const characterBeingEdited = useAtomValue(characterBeingEditedAtom);
	const characterDeletionMutation = useCharacterDeleteMutation();

	const handler = useCallback(
		() =>
			characterDeletionMutation.mutateAsync({
				characterId: characterBeingEdited?.id ?? "",
				strategy: {
					type: "item-delete",
				},
			}),
		[characterBeingEdited, characterDeletionMutation]
	);

	return handler;
};

/* #endregion */

const CharacterConfirmDeleteDialog = () => {
	useRenderLogging("CharacterConfirmDeleteDialog");

	const { isOpen, onClose } = useDisclosureAtom(
		characterDeleteConfirmationDialogIsOpenAtom
	);
	const {
		onClose: closeBaseCharacterDialog,
		isOpen: baseCharacterDialogIsOpen,
	} = useEntityTiedDialogAtom(characterDialogAtom);

	useEffect(() => {
		if (!baseCharacterDialogIsOpen && isOpen) {
			// Base character dialog may be closed by pressing back button, so we
			// need to close this dialog as well
			onClose();
		}
	});

	const strategySelectionForm = useStrategySelectionForm();
	const submitStrategySelectionForm =
		useHandleCharacterDeletionWithStrategyForm();
	const submitSimpleConfirmation =
		useHandleConfirmationWithItemDeleteStrategy();

	const itemsCarriedByEditTarget = useAtomValue(
		itemsCarriedByCharacterBeingEditedAtom
	);
	const characterBeingEdited = useAtomValue(characterBeingEditedAtom);

	const [isLoading, isLoadingController] = useBoolean();

	const submitFormData = useMemo(
		() =>
			A.isEmpty(itemsCarriedByEditTarget ?? [])
				? strategySelectionForm.handleSubmit(submitSimpleConfirmation)
				: strategySelectionForm.handleSubmit(submitStrategySelectionForm),
		[
			strategySelectionForm,
			itemsCarriedByEditTarget,
			submitSimpleConfirmation,
			submitStrategySelectionForm,
		]
	);

	const submissionHandler = useMemo(
		() =>
			flow(
				F.tap(isLoadingController.on),
				submitFormData,
				P.then(onClose),
				P.then(closeBaseCharacterDialog),
				P.then(isLoadingController.off)
			),
		[isLoadingController, closeBaseCharacterDialog, submitFormData, onClose]
	);

	return (
		<Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
			<ModalOverlay />
			<ModalContent as="form" onSubmit={submissionHandler}>
				<ModalHeader>
					Remove {`"${characterBeingEdited?.name}" from sheet?`}
				</ModalHeader>
				<ModalBody as={VStack} spacing="break" align="start">
					<Text>
						Are you sure you want to delete this party member from the sheet?
					</Text>
					{A.isNotEmpty(itemsCarriedByEditTarget ?? []) && (
						<>
							<Text>What should happen to items being carried by a?</Text>
							<StrategySelectionForm form={strategySelectionForm} />
						</>
					)}
				</ModalBody>
				<ModalFooter>
					<Button mr="group" variant="ghost" onClick={onClose}>
						Cancel
					</Button>
					<Button colorScheme="red" type="submit" isLoading={isLoading}>
						Confirm
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default CharacterConfirmDeleteDialog;
