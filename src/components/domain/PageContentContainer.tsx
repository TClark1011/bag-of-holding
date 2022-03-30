import { Box } from "@chakra-ui/react";
import React from "react";

/**
 * Wrap the content of pages like 'info' and 'contact'
 * and apply consistent horizontal padding
 *
 * @param props The props
 * @param props.children The page
 * content
 * @returns The page content wrapped
 * in a 'Box' with horizontal padding.
 */
const PageContentContainer: React.FC = ({ children }) => (
	<Box paddingX={[0, 16, 32, 64, 96]}>{children}</Box>
);

export default PageContentContainer;
