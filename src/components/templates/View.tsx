import { Box, BoxProps } from "@chakra-ui/layout";
import React, { PropsWithChildren } from "react";
import { use100vh } from "react-div-100vh";
import {
	Meta,
	MetaProps,
	topNavHeight,
	TopNavProps,
	TopNav,
} from "$root/components";

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
	accountForTopNav = showTopNav,
	children,
	...metaProps
}) => {
	const screenHeight = use100vh();

	const contentContainerProps: Pick<
		BoxProps,
		"height" | "minHeight" | "paddingX" | "paddingTop"
	> = {
		...(minFullHeight
			? { minHeight: screenHeight ?? undefined, height: 1 }
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
