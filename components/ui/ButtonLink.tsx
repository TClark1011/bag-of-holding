import { Button, ButtonProps } from "@chakra-ui/button";
import FlexibleLink, { FlexibleLinkProps } from "./FlexibleLink";

/**
 * A button that acts as a link
 *
 * @param {object} props The props
 * @param {string} props.href The link destination
 * @param {boolean} [props.useNextLink] see 'FlexibleLinkProps'
 * @param {object} [props.nextLinkProps] see 'FlexibleLinkProps'
 * @param {object} [props.chakraLinkProps] see 'FlexibleLinkProps'
 * @returns {React.ReactElement} Component stuff
 */
const ButtonLink: React.FC<ButtonProps & FlexibleLinkProps> = ({
	href,
	useNextLink,
	nextLinkProps,
	chakraLinkProps,
	...props
}) => {
	return (
		<FlexibleLink
			href={href}
			useNextLink={useNextLink}
			nextLinkProps={nextLinkProps}
			chakraLinkProps={chakraLinkProps}
		>
			<Button {...props} />
		</FlexibleLink>
	);
};

export default ButtonLink;
