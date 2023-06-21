import { useRenderLogging } from "$root/hooks";
import { hasId } from "$root/utils";
import { useEditItemMutation } from "$sheets/hooks";
import {
	selectCharacters,
	standaloneItemGiveToDialogAtom,
	useInventoryStore,
	useNullableIdTargetingDialogAtom,
	useOptionalItemWithId,
} from "$sheets/store";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Radio,
	RadioGroup,
	Stack,
} from "@chakra-ui/react";
import { A, F, flow } from "@mobily/ts-belt";
import { FC, useEffect, useMemo, useState } from "react";
import { P, match } from "ts-pattern";

const selectCharactersThatDoNotHaveId = (id: string) =>
	flow(selectCharacters, A.reject(hasId(id)));

const NULL = "null";

const StandaloneItemGiveToDialog: FC = () => {
	useRenderLogging("StandaloneItemGiveToDialog");

	const [selectedItem, setSelectedItem] = useState<string | undefined>(
		undefined
	);

	const {
		isOpen,
		onClose,
		targetId: itemId,
	} = useNullableIdTargetingDialogAtom(standaloneItemGiveToDialogAtom);
	const item = useOptionalItemWithId(itemId ?? "");
	const charactersThatCanReceiveItem = useInventoryStore(
		selectCharactersThatDoNotHaveId(item?.carriedByCharacterId ?? ""),
		[item]
	);
	const itemEditMutation = useEditItemMutation({
		onSuccess: onClose,
	});

	const itemIsCurrentlyCarriedBySomebody = useMemo(
		() => item?.carriedByCharacterId,
		[item]
	);

	useEffect(() => {
		// Have the first item be selected by default

		if (
			itemIsCurrentlyCarriedBySomebody &&
			charactersThatCanReceiveItem.length === 0
		) {
			// If the only item is "Nobody"...
			setSelectedItem(NULL);
		}

		if (
			!itemIsCurrentlyCarriedBySomebody &&
			charactersThatCanReceiveItem.length > 0
		) {
			// If the item is already carried by "Nobody" and there are characters
			// that can receive the item, set the first character as the default
			setSelectedItem(charactersThatCanReceiveItem[0].id);
		}
	}, [charactersThatCanReceiveItem, itemIsCurrentlyCarriedBySomebody]);

	const submit = () => {
		const selection: string | null = match(selectedItem)
			.with(P.union(NULL, P.nullish), () => null) // If the selection is nullish or is a string that just says "null" return null
			.otherwise(F.identity); //otherwise return the string

		return itemEditMutation.mutate({
			itemId: itemId ?? "",
			data: {
				carriedByCharacterId: selection,
			},
		});
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Give &quot;{item?.name}&quot; to...</ModalHeader>
				<ModalBody>
					<RadioGroup value={selectedItem} onChange={setSelectedItem}>
						<Stack>
							{item?.carriedByCharacterId && <Radio value={NULL}>Nobody</Radio>}
							{charactersThatCanReceiveItem.map((character) => (
								<Radio key={character.id} value={character.id}>
									{character.name}
								</Radio>
							))}
						</Stack>
					</RadioGroup>
				</ModalBody>
				<ModalFooter>
					<Button onClick={onClose} variant="ghost" mr="group">
						Cancel
					</Button>
					<Button
						isDisabled={!selectedItem}
						onClick={submit}
						isLoading={itemEditMutation.isLoading}
						colorScheme="primary"
					>
						Give
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default StandaloneItemGiveToDialog;
