import { Box } from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";

/**
 * Wrap the content of pages like 'info' and 'contact'
 * and apply consistent horizontal padding
 */
const PageContentContainer: React.FC<PropsWithChildren> = ({ children }) => (
	<Box paddingX={[0, 16, 32, 64, 96]}>{children}</Box>
);

export default PageContentContainer;
