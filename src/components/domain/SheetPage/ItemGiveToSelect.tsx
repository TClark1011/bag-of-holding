import { Select, SelectProps } from "@chakra-ui/select";
import { useEffect } from "react";
import { useSheetPageState } from "../../../state/sheetPageState";
import getIds from "../../../utils/getIds";
import { useInventoryState } from "../../contexts/InventoryStateContext";

type SpecialSelectProps = Omit<
	SelectProps,
	"value" | "defaultValue" | "onChange" | "onFocus" | "children"
>;
//? SelectProps but with any props that could interfere with functionality of the component removed
//? Makes sure the component will work while still allowing style props to work

export interface ItemGiveToSelectProps extends SpecialSelectProps {
	removingMemberId: string;
}

/**
 * Dropdown box for selecting which member should receive
 * the items of a member who has been targeted for removal
 * from the sheet.
 *
 * @param {object} props The props
 * @param {string} props.removingMemberId The `_id` of the
 * member targeted for removal from the sheet.
 * @returns {React.ReactNode} A dropdown box
 */
const ItemGiveToSelect: React.FC<ItemGiveToSelectProps> = ({
	removingMemberId,
	...props
}) => {
	const {
		selectNewSheetMemberRemovedMoveToMember,
		selectNewSheetMemberRemoveMethod,
		sheetMembersQueue,
	} = useSheetPageState();

	const { members } = useInventoryState();

	const membersAvailableToReceive = members.filter(
		(mem) =>
			![removingMemberId, ...getIds(sheetMembersQueue.remove)].includes(mem._id)
	);
	//? Members that are available to receive items (all members that are not the removal target or are in queue to be removed)

	useEffect(() => {
		selectNewSheetMemberRemovedMoveToMember(
			membersAvailableToReceive[0]._id || ""
		);
	}, []);

	return (
		<Select
			onChange={(e) => selectNewSheetMemberRemovedMoveToMember(e.target.value)}
			onFocus={() => selectNewSheetMemberRemoveMethod("move")}
			{...props}
		>
			{membersAvailableToReceive.map((mem) => (
				<option value={mem._id} key={mem._id}>
					{mem.name}
				</option>
			))}
		</Select>
	);
};

export default ItemGiveToSelect;
