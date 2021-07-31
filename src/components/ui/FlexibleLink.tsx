import NextLink, { LinkProps as NextLinkProps } from "next/link";
import {
	Link as ChakraLink,
	LinkProps as ChakraLinkProps,
} from "@chakra-ui/react";

type OmitHref<T> = Omit<T, "href">;

export interface FlexibleLinkProps {
	href: string;
	useNextLink?: boolean;
	nextLinkProps?: OmitHref<NextLinkProps>;
	chakraLinkProps?: OmitHref<ChakraLinkProps>;
}

/**
 * A link that can either use the smooth client-side loading
 * provided by the NextJS link component, or the more standard
 * link capabilities of the chakra ui 'Link' component
 *
 * @param props The props
 * @param props.href The link destination
 * @param [props.useNextLink=false] If true, the
 * component used will be the 'Link' component exported from
 * 'next/link'. Otherwise the 'Link' component from chakra ui
 * is used.
 * @param [props.nextLinkProps] The props to provide to
 * the link if it is using the NextJS link
 * @param [props.chakraLinkProps] The props to provide to
 * the link if it is using the Chakra UI link
 * @returns Component stuff
 */
const FlexibleLink: React.FC<FlexibleLinkProps> = ({
	href,
	useNextLink = false,
	nextLinkProps,
	chakraLinkProps,
	...props
}) => {
	return useNextLink ? (
		<NextLink href={href} {...nextLinkProps} {...props} />
	) : (
		<ChakraLink href={href} {...chakraLinkProps} {...props} />
	);
};

export default FlexibleLink;
