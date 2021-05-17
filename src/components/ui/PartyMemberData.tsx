import { Text, TextProps } from "@chakra-ui/layout";
import React from "react";
import InventoryMemberFields from "../../types/InventoryMemberFields";
import { OmitId } from "../../types/UtilityTypes";
import { useInventoryState } from "../contexts/InventoryStateContext";

export interface PartyMemberDataProps extends Omit<TextProps, "children"> {
	memberId: string;
	property: keyof OmitId<InventoryMemberFields>;
	fallback?: string | false;
}

/**
 * Display a single property of a member with the _id
 * that matches a provided id string.
 *
 * @param {object} props The props
 * @param {string} props.memberId The id of the member to get the
 * data of
 * @param {string} props.property The data property to display
 * @param {string | false} [props.fallback=props.memberId] The
 * fallback value to use if member with the passed `_id` is not
 * found. If passed boolean `false`, then this component will
 * return `null` if the member is not found. Defaults to the
 * passed `memberId` value
 * @returns {React.ReactNode} The fetched data inside a 'Text'
 * component. If no matching member is found, null is returned
 */
const PartyMemberData: React.FC<PartyMemberDataProps> = ({
	memberId,
	property,
	fallback = memberId,
	...props
}) => {
	const { members } = useInventoryState();

	const selectedMember = members.find((item) => item._id === memberId);

	return selectedMember ? (
		<Text {...props}>
			{selectedMember ? selectedMember[property] : fallback}
		</Text>
	) : // ? If member with matching id was found, return the value of the property
	fallback !== false ? (
		// ? If member was not found and fallback is not `false`, then return the fallback
		<Text {...props}>{fallback}</Text>
	) : null;
	//? If member was not found and fallback was `false`, then return `null`
};

export default PartyMemberData;
