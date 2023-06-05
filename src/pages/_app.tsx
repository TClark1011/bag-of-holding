import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import React from "react";
import { theme } from "$root/config";
import Head from "next/head";
import { appName } from "$root/constants";
import { Meta } from "$root/components";
import { AppProps } from "next/dist/shared/lib/router/router";
import { css, Global } from "@emotion/react";
import webAppManifest from "~PWA-MANIFEST";

import "$root/assets/fonts/Coves/stylesheet.css";
import "@fontsource/roboto";
import "@fontsource/roboto/100.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/700.css";
import queries from "$root/hooks/queries";

/**
 * Generate a selector to add a background color
 * to a page based on a desired color mode
 *
 * @param colorMode Which color mode to target
 * @param color What color to use as the
 * background
 * @returns CSS that selects the page background
 * and sets the background
 */
const thoroughColorModeSelector = (colorMode: string, color: string) => {
	const styleRule = `background: ${color}; background-color: ${color};`;
	return `
	@media (prefers-color-scheme: ${colorMode}) {
		html, body, #__next {
			${styleRule}
		}
	}
	html[data-theme="${colorMode}"] {
		&, body, #__next {
			${styleRule}
		}
	}
`;
};

/**
 * Core app component
 *
 * @param props The application props
 * @param props.Component The page component to be rendered
 * @param props.pageProps The props to pass to the page component
 * @returns The application
 */
const MyApp = ({ Component, pageProps }: AppProps): React.ReactElement => {
	const TypeBugWorkAroundComponent = Component as any; // This won't be needed once we upgrade to react 18
	return (
		<ChakraProvider theme={theme}>
			<ColorModeScript initialColorMode={theme.config.initialColorMode} />
			<Meta />
			<Head>
				<link rel="icon" href="/favicon.svg" key="favicon" />
				<link rel="manifest" href="/manifest.json" />

				<meta name="twitter:card" content="summary" />
				<meta property="og:site_name" content={appName} />
				<meta property="og:type" content="website" />

				<meta name="application-name" content={webAppManifest.name} />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<meta name="apple-mobile-web-app-title" content={webAppManifest.name} />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="theme-color" content={webAppManifest.theme_color} />
			</Head>
			<Global
				styles={css`
					${thoroughColorModeSelector("dark", theme.colors.gray[800])}
					${thoroughColorModeSelector("light", "white")}
				`}
			/>
			<TypeBugWorkAroundComponent {...pageProps} />
		</ChakraProvider>
	);
};

export default queries.withTRPC(MyApp);
