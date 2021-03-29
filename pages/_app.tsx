import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { AppProps } from "next/dist/next-server/lib/router/router";
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

		<Meta />
		<Head>
			<link rel="icon" href="/favicon.svg" key="favicon" />
			<meta name="twitter:card" content="summary" />
			<meta property="og:site_name" content={appName} />
		</Head>
		<Component {...pageProps} />
	</ChakraProvider>
);

export default MyApp;
