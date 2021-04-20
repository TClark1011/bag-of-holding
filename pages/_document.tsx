import Document, { Html, Head, Main, NextScript } from "next/document";
import React from "react";
import { GOOGLE_ANALYTICS_ID } from "../config/publicEnv";

class MyDocument extends Document {
	render(): JSX.Element {
		return (
			<Html>
				<Head>
					{/* Global Site Tag (gtag.js) - Google Analytics */}
					{/* <script
						async
						src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
					/>
					<script
						dangerouslySetInnerHTML={{
							__html: `
				window.dataLayer = window.dataLayer || [];
				function gtag(){dataLayer.push(arguments);}
				gtag('js', new Date());
				gtag('config', '${GOOGLE_ANALYTICS_ID}', {
				  page_path: window.location.pathname,
				});
			  `,
						}}
					/> */}
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
