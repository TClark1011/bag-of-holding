import { Control, Controller, Path, useForm } from "$hook-form";
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
	FormControl,
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
	VStack,
	chakra,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { D } from "@mobily/ts-belt";
import { FC, useEffect } from "react";
import { z } from "zod";

const useMoneyDialogModalProps = () => {
	const [isOpen, setIsOpen] = useDisappearingHashAtom(moneyDialogIsOpenAtom);

	return {
		isOpen,
		onClose: () => setIsOpen(false),
	};
};

const MoneyFormControl = chakra(FormControl, {
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

const zMoneyAmount = z.number().min(0);

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

const MoneyInput: FC<{
	name: Path<z.infer<typeof moneyFormSchema>>;
	control: Control<z.infer<typeof moneyFormSchema>>;
}> = ({ name, control }) => (
	<Controller
		name={name}
		control={control}
		rules={{}}
		render={({ field: { ref, onChange, ...restField } }) => (
			<NumberInput
				{...(restField as any)}
				onChange={(e) => onChange(Number(e))}
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

const MoneyDialog: FC = () => {
	useRenderLogging("MoneyDialog");

	const sheetId = useSheetPageId();
	const modalProps = useMoneyDialogModalProps();

	const defaultValues = useInventoryStore(selectMoneyFormDefaults, []);

	const { reset, control, handleSubmit, getFieldState } = useForm({
		resolver: moneyFormResolver,
		defaultValues,
	});

	const moneyChangeMutation = useMoneyUpdateMutation({
		onSuccess: modalProps.onClose,
	});

	useEffect(() => {
		reset(defaultValues);
	}, [reset, defaultValues, modalProps.isOpen]);

	const characters = useInventoryStore(selectCharacters, []);

	return (
		<Modal {...modalProps} size="xs">
			<ModalOverlay />
			<ModalContent
				as="form"
				onSubmit={handleSubmit(async (data) => {
					const partyMoneyFieldWasChanged = getFieldState(
						f("partyMoney")
					).isDirty;

					const characterWithIdMoneyWasChanged = (characterId: string) =>
						getFieldState(f(`characters.${characterId}`)).isDirty;
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
					<MoneyFormControl>
						<MoneyFormLabel htmlFor={f("partyMoney")}>
							Party Money
						</MoneyFormLabel>
						<MoneyInput name={f("partyMoney")} control={control} />
					</MoneyFormControl>

					{characters.length > 0 && (
						<>
							<Divider my="break" />
							<VStack spacing="group">
								{characters.map((character) => (
									<MoneyFormControl key={character.id}>
										<MoneyFormLabel htmlFor={character.id}>
											{character.name}
										</MoneyFormLabel>
										<MoneyInput
											name={`characters.${character.id}`}
											control={control}
										/>
									</MoneyFormControl>
								))}
							</VStack>{" "}
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
