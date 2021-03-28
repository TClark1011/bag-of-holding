import { InventorySheetMenuItemFields } from "../types/InventorySheetFields";

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
}: Omit<InventorySheetMenuItemFields, "lastAccessedAt">): void => {
	const sheets = fetchRememberedSheets();

	const newSheet = { _id, name, members };

	const idsOnly = sheets.map((item) => item._id);

	if (!idsOnly.includes(_id)) {
		sheets.push({ ...newSheet, lastAccessedAt: new Date() });
		//? If sheets does not include the sheet being added, added to the sheets list
	} else {
		sheets.forEach((item) => {
			if (item._id === _id) {
				item.name = name;
				item.members = members;
				item.lastAccessedAt = new Date();
			}
		});
		//? If sheet list already contains the 'new' sheet, update the sheet entry
	}
	saveRememberedSheets(sheets);
};
