/* eslint-disable @typescript-eslint/no-var-requires */
const { withSuperjson } = require("next-superjson");
const maintenanceRedirectDestination = "/";
const { flow } = require("@mobily/ts-belt");
const withPWA = require("next-pwa");

const injectPlugins = flow(
	withPWA({
		dest: "public",
		disable: process.env.NODE_ENV === "development",
	}),
	withSuperjson()
);

module.exports = injectPlugins({
	env: {
		MONTHS_INACTIVE_OLD_SHEET_DELETE: "3",
		// Default value so tests don't throw an error
	},
	redirects: async () => {
		return process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true"
			? [
					{
						source: "/sheets/:id*",
						destination: maintenanceRedirectDestination,
						permanent: false,
					},
					{
						source: "/new",
						destination: maintenanceRedirectDestination,
						permanent: false,
					},
			  ]
			: [];
	},
});
