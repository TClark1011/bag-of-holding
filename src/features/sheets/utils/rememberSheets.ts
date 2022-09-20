import { SheetMenuItemFields } from "$sheets/types";

const sheetMemoryKey = "previously-visited-sheets";

/**
 * Fetch sheets that are 'recharactered' in localStorage
 *
 * @returns The sheets
 */
export const fetchRememberedSheets = (): SheetMenuItemFields[] =>
	JSON.parse(localStorage.getItem(sheetMemoryKey) || "[]");

/**
 * Update the 'recharactered' sheets
 *
 * @param items The
 * items to update the stored 'recharacteredItems' sheet
 * with
 */
export const saveRememberedSheets = (items: SheetMenuItemFields[]): void => {
	localStorage.setItem(sheetMemoryKey, JSON.stringify(items));
};

/**
 * Add a sheet to the 'recharactered' sheets field in localStorage
 *
 * @param sheet The sheet
 * @param sheet.id Sheet id
 * @param sheet.name Sheet name
 * @param sheet.characters The party characters from the sheet
 */
export const addToRememberedSheets = ({
	id,
	name,
	characters,
}: Omit<SheetMenuItemFields, "lastAccessedAt">): void => {
	const sheets = fetchRememberedSheets();

	const newSheet = { id, name, characters };

	const idsOnly = sheets.map((item) => item.id);

	if (!idsOnly.includes(id)) {
		sheets.push({ ...newSheet, lastAccessedAt: new Date() });
		//? If sheets does not include the sheet being added, added to the sheets list
	} else {
		sheets.forEach((item) => {
			if (item.id === id) {
				item.name = name;
				item.characters = characters;
				item.lastAccessedAt = new Date();
			}
		});
		//? If sheet list already contains the 'new' sheet, update the sheet entry
	}
	saveRememberedSheets(sheets);
};
