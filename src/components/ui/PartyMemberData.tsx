import { Text, TextProps } from "@chakra-ui/layout";
import React from "react";
import InventoryMemberFields from "../../types/InventoryMemberFields";
import { OmitId } from "../../types/UtilityTypes";
import findItemWithId from "../../utils/findItemWithId";
import { useInventoryState } from "../contexts/InventoryStateContext";

export interface PartyMemberDataProps extends Omit<TextProps, "children"> {
	memberId: string;
	property: keyof OmitId<InventoryMemberFields>;
}

/**
 * Display a single property of a member with the _id
 * that matches a provided id string.
 *
 * @param {object} props The props
 * @param {string} props.memberId The id of the member to get the
 * data of
 * @param {string} props.property The data property to display
 * @returns {React.ReactNode} The fetched data inside a 'Text'
 * component. If no matching member is found, null is returned
 */
const PartyMemberData: React.FC<PartyMemberDataProps> = ({
	memberId,
	property,
	...props
}) => {
	const { members } = useInventoryState();

	const selectedMember = findItemWithId(members, memberId);
	return selectedMember ? (
		<Text {...props}>{selectedMember[property]}</Text>
	) : null;
};

export default PartyMemberData;
