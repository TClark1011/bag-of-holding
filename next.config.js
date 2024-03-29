/* eslint-disable @typescript-eslint/no-var-requires */
const { withSuperjson } = require("next-superjson");
const { flow } = require("@mobily/ts-belt");
const withPWA = require("next-pwa");
const withTranspileModules = require("next-transpile-modules");

const shouldAnalyzeBundle = process.env.ANALYZE_BUNDLE === "true";

const getBundleAnalyzerPlugin = () => {
	// Required since we install the bundle analyzer as a dev dependency
	const withBundleAnalyzer = require("@next/bundle-analyzer");

	return withBundleAnalyzer({
		enabled: true
	});
}

const injectPlugins = flow(
	withPWA({
		dest: "public",
		disable: process.env.NODE_ENV === "development",
		disableDevLogs: true
	}),
	withSuperjson(),
	withTranspileModules(["jotai-devtools"]),
	...(shouldAnalyzeBundle ? [getBundleAnalyzerPlugin()] : [])
);

module.exports = injectPlugins({
	env: {
		MONTHS_INACTIVE_OLD_SHEET_DELETE: "3"
		// Default value so tests don't throw an error
	},
	redirects: async () => {
		return process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true"
			? [
					{
						source: "/sheets/:id*",
						destination: "/",
						permanent: false
					}
			  ]
			: [];
	}
});
