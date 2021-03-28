import InventorySheetFields, {
	InventorySheetMenuItemFields,
} from "../types/InventorySheetFields";

const sheetMemoryKey = "previously-visited-sheets";

/**
 * Fetch sheets that are 'remembered' in localStorage
 *
 * @returns {InventorySheetMenuItemFields[]} The sheets
 */
export const fetchRememberedSheets = (): InventorySheetMenuItemFields[] =>
	JSON.parse(localStorage.getItem(sheetMemoryKey) || "[]");

/**
 * Update the 'remembered' sheets
 *
 * @param {InventorySheetMenuItemFields[]} items The
 * items to update the stored 'rememberedItems' sheet
 * with
 */
export const saveRememberedSheets = (
	items: InventorySheetMenuItemFields[]
): void => {
	localStorage.setItem(sheetMemoryKey, JSON.stringify(items));
};

/**
 * Add a sheet to the 'remembered' sheets field in localStorage
 *
 * @param {object} sheet The sheet
 * @param {string} sheet._id Sheet id
 * @param {string} sheet.name Sheet name
 * @param {string[]} sheet.members The party members from the sheet
 */
export const addToRememberedSheets = ({
	_id,
	name,
	members,
}: InventorySheetFields): void => {
	const result = fetchRememberedSheets();

	const sheet = { _id, name, members };
	if (!result.includes(sheet)) {
		result.push(sheet);
		saveRememberedSheets(result);
	}
};
