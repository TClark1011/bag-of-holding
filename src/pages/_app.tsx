import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import React from "react";
import theme from "../config/theme";
import "../assets/fonts/Coves/stylesheet.css";
import "@fontsource/roboto";
import "@fontsource/roboto/100.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/700.css";
import Head from "next/head";
import { appName } from "../constants/branding";
import Meta from "../components/templates/Meta";
import "@hookstate/devtools";
import { AppProps } from "next/dist/shared/lib/router/router";

/**
 * Core app component
 *
 * @param props The application props
 * @param props.Component The page component to be rendered
 * @param props.pageProps The props to pass to the page component
 * @returns The application
 */
const MyApp = ({ Component, pageProps }: AppProps): React.ReactElement => {
	return (
		<ChakraProvider theme={theme}>
			<ColorModeScript initialColorMode={theme.config.initialColorMode} />
			<Meta />
			<Head>
				<link rel="icon" href="/favicon.svg" key="favicon" />
				<meta name="twitter:card" content="summary" />
				<meta property="og:site_name" content={appName} />
				<meta property="og:type" content="website" />
			</Head>
			<Component {...pageProps} />
		</ChakraProvider>
	);
};

export default MyApp;
