import { Box, BoxProps } from "@chakra-ui/layout";
import React from "react";
import { use100vh } from "react-div-100vh";
import TopNav, { topNavHeight, TopNavProps } from "../domain/TopNav";
import Meta, { MetaProps } from "./Meta";
import {
	AnalyticsPageViewProps,
	useAnalyticsPageView,
} from "../../utils/analyticsHooks";

type ExtraProps = MetaProps & TopNavProps;
export type ViewProps = ExtraProps & {
	showTopNav?: boolean;
	minFullHeight?: boolean;
	accountForTopNav?: boolean;
	analyticsPageViewProps?: AnalyticsPageViewProps;
	doNotLogPageView?: boolean;
};

/**
 * A template component for constructing views within the
 * application
 *
 * @param props The props
 * @param [props.showTopNav=true] Whether or not to show
 * the top navigation bar in the view
 * @param [props.showHomeLink=true] Whether or
 * not to show a link to return to the home page of the
 * application
 * @param [props.minFullHeight=true] If true, the minimum
 * height of the root "main" element is set to be equal to the screen
 * height. Height of the screen is calculated using the 'use100vh'
 * hook.
 * @param [props.accountForTopNav=true] If true, top padding
 * is added to the element containing the page content to account for
 * the height of the "absolute" position top navigation bar
 * of the view
 * @param [props.analyticsPageViewProps={}] Props for defining
 * the page view event that will be sent to the analytics tracker when
 * this page is viewed
 * @param [props.doNotLogPageView=false] If true, a pageView event will not
 * be logged in analytics.
 * @param props.children The main content
 * @returns Rendered view
 */
const View: React.FC<ViewProps> = ({
	showTopNav = true,
	showHomeLink = true,
	minFullHeight = true,
	accountForTopNav = showTopNav,
	children,
	analyticsPageViewProps = {},
	doNotLogPageView = false,
	...metaProps
}) => {
	useAnalyticsPageView({
		...(metaProps.title && { title: metaProps.title }),
		...analyticsPageViewProps,
		shouldLogPageView: !doNotLogPageView,
	});

	const screenHeight = use100vh();

	const contentContainerProps: Pick<
		BoxProps,
		"height" | "minHeight" | "paddingX" | "paddingTop"
	> = {
		...(minFullHeight ? { minHeight: screenHeight, height: 1 } : {}),
		paddingTop: accountForTopNav ? topNavHeight : null,
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
