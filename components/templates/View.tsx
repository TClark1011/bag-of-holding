import { Box, BoxProps } from "@chakra-ui/layout";
import React from "react";
import { use100vh } from "react-div-100vh";
import TopNav, { TopNavProps } from "../contexts/TopNav";
import Meta, { MetaProps } from "./Meta";

type ExtraProps = MetaProps & TopNavProps;
export type ViewProps = ExtraProps & {
	showTopNav?: boolean;
	minFullHeight?: boolean;
};

/**
 * A template component for constructing views within the
 * application
 *
 * @param {object} props The props
 * @param {boolean} [props.showTopNav=true] Whether or not to show
 * the top navigation bar in the view
 * @param {boolean} [props.showHomeLink=true] Whether or
 * not to show a link to return to the home page of the
 * application
 * @param {boolean} [props.minFullHeight=true] If true, the minimum
 * height of the root "main" element is set to be equal to the screen
 * height. Height of the screen is calculated using the 'use100vh'
 * hook.
 * @param {React.ReactElement} props.children The main content
 * of the view
 * @returns {React.ReactElement} Rendered view
 */
const View: React.FC<ViewProps> = ({
	showTopNav = true,
	showHomeLink = true,
	minFullHeight = true,
	children,
	...metaProps
}) => {
	const screenHeight = use100vh();

	const heightProps: Pick<BoxProps, "height" | "minHeight"> = minFullHeight
		? { minHeight: screenHeight, height: 1 }
		: {};

	return (
		<Box as="main" {...heightProps}>
			<Meta {...metaProps} />
			{showTopNav && <TopNav showHomeLink={showHomeLink} />}
			{children}
		</Box>
	);
};

export default View;
