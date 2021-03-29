import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { AppProps } from "next/dist/next-server/lib/router/router";
import React from "react";
import theme from "../config/theme";
import "../assets/fonts/Coves/stylesheet.css";
import "@fontsource/roboto/100.css";
import "@fontsource/roboto/400.css";

/**
 * Core app component
 *
 * @param {AppProps} props The application props
 * @param {React.ComponentType} props.Component The page component to be rendered
 * @param {object} props.pageProps The props to pass to the page component
 * @returns {React.ReactElement} The application
 */
const MyApp = ({ Component, pageProps }: AppProps): React.ReactElement => (
	<ChakraProvider theme={theme}>
		<ColorModeScript initialColorMode={theme.config.initialColorMode} />
		<Component {...pageProps} />
	</ChakraProvider>
);

export default MyApp;
