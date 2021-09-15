/* eslint-disable jsdoc/require-jsdoc */

const maintenanceRedirectDestination = "/";

module.exports = {
	webpack5: true,

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
};
