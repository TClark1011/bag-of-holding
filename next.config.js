/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable jsdoc/require-jsdoc */
const { withSuperjson } = require("next-superjson");
const maintenanceRedirectDestination = "/";

module.exports = withSuperjson()({
	webpack: true,
	env: {
		MONGO_URL: "_",
		MONTHS_INACTIVE_OLD_SHEET_DELETE: "3",
		// Default value so tests dont throw an error
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
