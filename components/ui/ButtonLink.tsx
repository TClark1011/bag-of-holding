import { Button, ButtonProps } from "@chakra-ui/button";
import Link from "next/link";

export interface ButtonLinkProps extends ButtonProps {
	href: string;
}

/**
 * A button that acts as a link
 *
 * @param {object} props The props
 * @param {string} props.href The link destination
 * @returns {React.ReactElement} Component stuff
 */
const ButtonLink: React.FC<ButtonLinkProps> = ({ href, ...props }) => (
	<Link href={href}>
		<Button {...props} />
	</Link>
);

export default ButtonLink;
