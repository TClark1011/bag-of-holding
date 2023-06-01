import { Button, ButtonProps } from "@chakra-ui/react";
import { FlexibleLinkProps, FlexibleLink } from "$root/components";

/**
 * A button that acts as a link
 *
 * @param props.href The link destination
 * @param [props.useNextLink] see 'FlexibleLinkProps'
 * @param [props.nextLinkProps] see 'FlexibleLinkProps'
 * @param [props.chakraLinkProps] see 'FlexibleLinkProps'
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
