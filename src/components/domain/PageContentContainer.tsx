import { Container } from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";

/**
 * Wrap the content of pages like 'info' and 'contact'
 * and apply consistent horizontal padding
 */
const PageContentContainer: React.FC<PropsWithChildren> = ({ children }) => (
	<Container centerContent>{children}</Container>
);

export default PageContentContainer;
