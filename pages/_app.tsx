import { AppProps } from "next/dist/next-server/lib/router/router";
import React from "react";

/**
 * Core app component
 *
 * @param {AppProps} props The application props
 * @param {React.ComponentType} props.Component The page component to be rendered
 * @param {object} props.pageProps The props to pass to the page component
 * @returns {React.ReactElement} The application
 */
const MyApp = ({ Component, pageProps }: AppProps): React.ReactElement => {
	return <Component {...pageProps} />;
};

export default MyApp;
