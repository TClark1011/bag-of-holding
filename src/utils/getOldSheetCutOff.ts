import { MONTHS_INACTIVE_OLD_SHEET } from "$root/config";
import { subMonths } from "date-fns";

/**
 * Fetch the latest date by a which sheet must have been edited to not be
 * considered stale.
 * Stale sheets will be automatically deleted
 */
const getOldSheetCutOff = () =>
	subMonths(new Date(), MONTHS_INACTIVE_OLD_SHEET);

export default getOldSheetCutOff;
