import { getUrlSlug } from "$root/utils";

/**
 * Pulls the id of the sheet from the url slug
 *
 * @returns the id of the sheet, when run on the
 * server, returns an empty string since the
 * url is not accessible
 */
const useSheetPageId = () => {
	const id = getUrlSlug()?.[2] || "";

	return id;
};

export default useSheetPageId;
