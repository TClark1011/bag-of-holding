import { Control, Controller, Path, useForm, useWatch } from "$hook-form";
import { useDisappearingHashAtom } from "$jotai-hash-disappear-atom";
import { useRenderLogging } from "$root/hooks";
import { createSchemaKeyHelperFunction } from "$root/utils";
import { useMoneyUpdateMutation, useSheetPageId } from "$sheets/hooks";
import {
	InventoryStoreSelector,
	moneyDialogIsOpenAtom,
	selectCharacters,
	selectPartyMoney,
	useInventoryStore,
} from "$sheets/store";
import {
	Button,
	Divider,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	StyleProps,
	Text,
	VStack,
	chakra,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { A, D, N, pipe } from "@mobily/ts-belt";
import { FC, useEffect } from "react";
import { z } from "zod";

const useMoneyDialogModalProps = () => {
	const [isOpen, setIsOpen] = useDisappearingHashAtom(moneyDialogIsOpenAtom);

	return {
		isOpen,
		onClose: () => setIsOpen(false),
	};
};

const MoneyLabelInputWrapper = chakra("div", {
	baseStyle: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	},
});

const MoneyFormLabel = chakra(FormLabel, {
	baseStyle: {
		margin: 0,
	},
});

const zMoneyAmount = z.preprocess(
	Number,
	z
		.number({
			invalid_type_error: "Invalid Number",
		})
		.min(0)
);

const moneyFormSchema = z.object({
	partyMoney: zMoneyAmount,
	characters: z.record(zMoneyAmount),
});

const f = createSchemaKeyHelperFunction(moneyFormSchema);

const moneyFormResolver = zodResolver(moneyFormSchema);

const selectMoneyFormDefaults: InventoryStoreSelector<
	z.infer<typeof moneyFormSchema>
> = (state) => {
	const characters = selectCharacters(state);
	const partyMoney = selectPartyMoney(state);

	const characterIdsToMoney: Record<string, number> = {};

	characters.forEach((character) => {
		characterIdsToMoney[character.id] = character.money;
	});

	return {
		partyMoney,
		characters: characterIdsToMoney,
	};
};

type MoneyFormControl = Control<z.infer<typeof moneyFormSchema>>;

const MoneyInput: FC<{
	name: Path<z.infer<typeof moneyFormSchema>>;
	control: MoneyFormControl;
}> = ({ name, control }) => (
	<Controller
		name={name}
		control={control}
		rules={{}}
		render={({ field: { ref, onChange, ...restField } }) => (
			<NumberInput
				{...(restField as any)}
				onChange={(e) => onChange(e)}
				min={0}
			>
				<NumberInputField id={name} ref={ref} name={restField.name} w={32} />
				<NumberInputStepper>
					<NumberIncrementStepper />
					<NumberDecrementStepper />
				</NumberInputStepper>
			</NumberInput>
		)}
	></Controller>
);

const IndividualPartyMemberTotal: FC<
	{
		control: MoneyFormControl;
	} & StyleProps
> = ({ control, ...elementProps }) => {
	const characters = useWatch({ name: "characters", control });

	const total = pipe(characters, D.values, A.reduce(0, N.add));

	return <Text {...elementProps}>{total}</Text>;
};

const MoneyDialog: FC = () => {
	useRenderLogging("MoneyDialog");

	const sheetId = useSheetPageId();
	const modalProps = useMoneyDialogModalProps();

	const defaultValues = useInventoryStore(selectMoneyFormDefaults, []);

	const { reset, control, handleSubmit, formState } = useForm({
		resolver: moneyFormResolver,
		defaultValues,
		mode: "onChange", // We use onChange because all the fields are controlled
		// inputs, which makes their behaviour a little different than normal
	});

	const moneyChangeMutation = useMoneyUpdateMutation({
		onSuccess: modalProps.onClose,
	});

	useEffect(() => {
		if (modalProps.isOpen) {
			reset(defaultValues);
		}
	}, [reset, defaultValues, modalProps.isOpen]);

	const characters = useInventoryStore(selectCharacters, []);

	return (
		<Modal {...modalProps} size="xs">
			<ModalOverlay />
			<ModalContent
				as="form"
				onSubmit={handleSubmit(async (data) => {
					const partyMoneyFieldWasChanged =
						data.partyMoney !== defaultValues.partyMoney;

					const characterWithIdMoneyWasChanged = (
						characterId: string,
						newMoney: number
					) => newMoney !== defaultValues.characters[characterId];
					const charactersThatWereChanged = D.filterWithKey(
						data.characters,
						characterWithIdMoneyWasChanged
					) as Record<string, number>;

					const noChangesWereMade =
						!partyMoneyFieldWasChanged && D.isEmpty(charactersThatWereChanged);

					if (noChangesWereMade) {
						modalProps.onClose();
						return;
					}

					await moneyChangeMutation.mutateAsync({
						characterIdsToMoney: charactersThatWereChanged,
						sheetData: partyMoneyFieldWasChanged
							? {
									sheetId,
									partyMoney: data.partyMoney,
							  }
							: undefined,
					});

					return;
				})}
			>
				<ModalCloseButton />
				<ModalHeader>Money</ModalHeader>
				<ModalBody>
					<FormControl isInvalid={!!formState.errors.partyMoney}>
						<MoneyLabelInputWrapper>
							<MoneyFormLabel htmlFor={f("partyMoney")}>
								Party Money
							</MoneyFormLabel>
							<MoneyInput name={f("partyMoney")} control={control} />
						</MoneyLabelInputWrapper>
						<FormErrorMessage>
							{formState.errors.partyMoney?.message}
						</FormErrorMessage>
					</FormControl>

					{characters.length > 0 && (
						<>
							<Divider my="break" />
							<VStack spacing="group" mb="group">
								{characters.map((character) => (
									<FormControl
										key={character.id}
										isInvalid={!!formState.errors.characters?.[character.id]}
									>
										<MoneyLabelInputWrapper>
											<MoneyFormLabel htmlFor={character.id}>
												{character.name}
											</MoneyFormLabel>
											<MoneyInput
												name={`characters.${character.id}`}
												control={control}
											/>
										</MoneyLabelInputWrapper>
										<FormErrorMessage>
											{formState.errors.characters?.[character.id]?.message}
										</FormErrorMessage>
									</FormControl>
								))}
							</VStack>
							{characters.length > 1 && (
								<Flex
									justifyContent="space-between"
									bg="shade.100"
									borderRadius="md"
									p={2}
								>
									<Text fontWeight="bold">Characters Total:</Text>
									<IndividualPartyMemberTotal control={control} />
								</Flex>
							)}
						</>
					)}
				</ModalBody>
				<ModalFooter>
					<Button variant="ghost" mr={3} onClick={modalProps.onClose}>
						Cancel
					</Button>
					<Button
						colorScheme="primary"
						type="submit"
						isLoading={moneyChangeMutation.isLoading}
					>
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default MoneyDialog;
