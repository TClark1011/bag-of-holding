import { selectCharacterWithId, useInventoryStore } from "$sheets/store";
import { Text, TextProps } from "@chakra-ui/layout";
import { Character } from "@prisma/client";
import React from "react";
import { OmitId } from "../../../types/UtilityTypes";

export interface PartyMemberDataProps extends Omit<TextProps, "children"> {
	memberId: string;
	property: keyof OmitId<Character>;
	fallback?: string | false;
}

/**
 * Looks up a member using a passed id value and displays
 * a specified prop of that member.
 *
 * @param props The props
 * @param props.memberId The id of the member to get the
 * data of
 * @param props.property The data property to display
 * @param [props.fallback=props.memberId] The
 * fallback value to use if member with the passed `id` is not
 * found. If passed boolean `false`, then this component will
 * return `null` if the member is not found. Defaults to the
 * passed `memberId` value.
 * @returns The fetched data inside a 'Text'
 * component. If no matching member is found, null is returned
 */
const PartyMemberData: React.FC<PartyMemberDataProps> = ({
	memberId,
	property,
	fallback = memberId,
	...props
}) => {
	const selectedMember = useInventoryStore(selectCharacterWithId(memberId));

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
