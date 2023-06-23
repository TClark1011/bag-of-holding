import { Box, BoxProps } from "@chakra-ui/layout";
import React, { PropsWithChildren } from "react";
import {
	Meta,
	MetaProps,
	topNavHeight,
	TopNavProps,
	TopNav,
} from "$root/components";
import useViewportHeight from "$use-viewport-height";

type ExtraProps = MetaProps & TopNavProps;
export type ViewProps = ExtraProps &
	PropsWithChildren & {
		showTopNav?: boolean;
		minFullHeight?: boolean;
		accountForTopNav?: boolean;
		doNotLogPageView?: boolean;
	};

const View: React.FC<ViewProps> = ({
	showTopNav = true,
	showHomeLink = true,
	minFullHeight = true,
	accountForTopNav = showTopNav, // adds padding to top of content to account for top nav
	children,
	...metaProps
}) => {
	const viewportHeight = useViewportHeight();

	const contentContainerProps: Pick<
		BoxProps,
		"height" | "minHeight" | "paddingX" | "paddingTop"
	> = {
		...(minFullHeight
			? { minHeight: viewportHeight ?? undefined, height: 1 }
			: {}),
		paddingTop: accountForTopNav ? topNavHeight : undefined,
	};

	return (
		<Box as="main">
			<Meta {...metaProps} />
			{showTopNav && <TopNav showHomeLink={showHomeLink} />}
			<Box {...contentContainerProps}>{children}</Box>
		</Box>
	);
};

export default View;
