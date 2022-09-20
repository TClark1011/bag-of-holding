import { getIds } from "$root/utils";
import { useInventoryState } from "$sheets/providers";
import { useSheetPageState } from "$sheets/store";
import { DeleteCharacterItemHandlingMethods } from "$sheets/types";
import { Select, SelectProps } from "@chakra-ui/react";
import { useEffect } from "react";

type SpecialSelectProps = Omit<
	SelectProps,
	"value" | "defaultValue" | "onChange" | "onFocus" | "children"
>;
//? SelectProps but with any props that could interfere with functionality of the component removed
//? Makes sure the component will work while still allowing style props to work

export interface ItemGiveToSelectProps extends SpecialSelectProps {
	removingCharacterId: string;
}

/**
 * Dropdown box for selecting which character should receive
 * the items of a character who has been targeted for removal
 * from the sheet.
 *
 * @param props The props
 * @param props.removingCharacterId The `id` of the
 * character targeted for removal from the sheet.
 * @returns A dropdown box
 */
const ItemGiveToSelect: React.FC<ItemGiveToSelectProps> = ({
	removingCharacterId,
	...props
}) => {
	const {
		selectNewSheetCharacterRemovedMoveToCharacter,
		selectNewSheetCharacterRemoveMethod,
		sheetCharactersQueue,
	} = useSheetPageState();

	const { characters } = useInventoryState();

	const charactersAvailableToReceive = characters.filter(
		(mem) =>
			![removingCharacterId, ...getIds(sheetCharactersQueue.remove)].includes(
				mem.id
			)
	);
	//? Characters that are available to receive items (all characters that are not the removal target or are in queue to be removed)

	useEffect(() => {
		selectNewSheetCharacterRemovedMoveToCharacter(
			charactersAvailableToReceive[0].id || ""
		);
	}, []);

	return (
		<Select
			onChange={(e) =>
				selectNewSheetCharacterRemovedMoveToCharacter(e.target.value)
			}
			onFocus={() =>
				selectNewSheetCharacterRemoveMethod(
					DeleteCharacterItemHandlingMethods.give
				)
			}
			{...props}
		>
			{charactersAvailableToReceive.map((mem) => (
				<option value={mem.id} key={mem.id}>
					{mem.name}
				</option>
			))}
		</Select>
	);
};

export default ItemGiveToSelect;
