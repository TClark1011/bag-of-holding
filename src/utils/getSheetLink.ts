import { appDomain } from "../constants/branding";
import { sheetsUrlPrefix } from "../constants/urls";

/**
 * Generate a link to a sheet.
 * Generating the links is very simple and under normal
 * circumstances would not require a dedicated function
 * to achieve, however we use it here so that if we ever
 * want to shuffle around page routes at a later date
 * we can very easily adjust all sheet links.
 *
 * @param sheetId The id of the sheet to generate
 * the link to
 * @param [fullLink=false] If true, we generate a
 * 'full' link that includes the root domain, as opposed to
 * a relative link
 * @returns The generated link
 */
const getSheetLink = (sheetId: string, fullLink = false): string =>
	(fullLink ? appDomain : "") + sheetsUrlPrefix + sheetId;

export default getSheetLink;
