import { Stack, StackProps } from "@chakra-ui/layout";
import { Tag, TagProps } from "@chakra-ui/tag";

export interface PartyMemberTagListProps extends StackProps {
	members: string[];
	tagProps?: TagProps;
}

/**
 * A stack of tags showing the members of a party
 *
 * @param {object} props The props
 * @param {string[]} props.members The party members
 * @param {TagProps} props.tagProps The props to pass
 * to the tags
 * @returns {React.ReactElement} Component stuff
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
