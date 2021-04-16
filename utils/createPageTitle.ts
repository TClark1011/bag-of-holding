/**
 * Generate a string to be used as the title in
 * a page's metadata by prefixing a provided string
 * with the name of the app.
 *
 * @param {string} pageTitle The title to use for the
 * page that will be prefixed with the app name
 * @returns {string} The provided 'pageTitle' prefixed
 * with the name of the app
 */
const createPageTitle = (pageTitle: string): string =>
	`Bag of Holding | ${pageTitle}`;

export default createPageTitle;
