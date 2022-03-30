import { Stack, StackProps, Tag, TagProps } from "@chakra-ui/react";

export interface PartyMemberTagListProps extends StackProps {
	members: string[];
	tagProps?: TagProps;
}

/**
 * A stack of tags showing the members of a party
 *
 * @param props The props
 * @param props.members The party members
 * @param props.tagProps The props to pass
 * to the tags
 * @returns Component stuff
 */
const PartyMemberTagList: React.FC<PartyMemberTagListProps> = ({
	members,
	tagProps,
	...props
}) => (
	<Stack direction="row" spacing="group" {...props}>
		{members.map((item, index) => (
			<Tag key={index} {...tagProps}>
				{item}
			</Tag>
		))}
	</Stack>
);

export default PartyMemberTagList;
