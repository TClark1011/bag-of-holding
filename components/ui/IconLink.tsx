import { IconButton, IconButtonProps } from "@chakra-ui/button";
import Link from "next/link";

interface IconLinkProps extends IconButtonProps {
	href: string;
}

/**
 * An IconButton that acts as a link
 *
 * @param {object} props The props
 * @param {string} props.href The link destination
 * @returns {React.ReactElement} Component stuff
 */
const IconLink: React.FC<IconLinkProps> = ({ href, ...props }) => (
	<Link href={href}>
		<IconButton isRound {...props} />
	</Link>
);

export default IconLink;
