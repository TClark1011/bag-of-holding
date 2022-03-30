import { isBuildingForProd } from "$root/config";

/**
 * Throw an error if the application is being built for
 * production deployment, otherwise just log a warning.
 * Used to create reminders to add or test new features
 * before the application is deployed to production.
 *
 * @param msg The message to attach to the error
 * or warning
 */
const blockProdBuild = (msg: string): void => {
	if (isBuildingForProd) {
		throw Error(msg);
	} else {
		console.warn(msg);
	}
};

export default blockProdBuild;
