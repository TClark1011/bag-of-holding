import { IconButton, IconButtonProps } from "@chakra-ui/button";
import { Link } from "@chakra-ui/layout";

interface IconLinkProps extends IconButtonProps {
	href: string;
}

/**
 * An IconButton that acts as a link
 *
 * @param props The props
 * @param props.href The link destination
 * @returns Component stuff
 */
const IconLink: React.FC<IconLinkProps> = ({ href, ...props }) => (
	<Link href={href}>
		<IconButton isRound variant="ghost" {...props} />
	</Link>
);

export default IconLink;
