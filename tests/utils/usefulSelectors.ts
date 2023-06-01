//# Generic
export const itemsTable = "#items-table";
export const columnFilterButton = '[aria-label="filter"]';
export const searchBar = '[placeholder="Search"]';
export const sheetOptionsButton = "#options-button";

//# Playwright only
// export const openPopover =
// 	":below([aria-expanded=\"true\"] > .chakra-popover__body)";
export const openPopover = '.chakra-popover__body:near([aria-expanded="true"])';
export const sheetOptionsAddMemberButton = "text=Save";
export const sheetAddCharacterButton = 'button:has-text("Add Character")';
export const characterDialogSaveButton = 'button:has-text("Save")';
export const sheetOptionsSaveButton = 'button:has-text("Save")';
export const sheetCharacterTag = ".character-tag";
export const sheetNewItemButton = "text=Add New Item";
export const sheetNewItemSaveButton = 'button:has-text("Create")';

export const selectWithinTable = (selector: string) =>
	`${itemsTable} >> ${selector}`;
export const selectWithinColumnHeader = (
	columnTitle: string,
	selector: string
) => selectWithinTable(`th:has-text("${columnTitle}") >> ${selector}`);

/**
 * Generates a string that can be used with playwright
 * to conveniently write a selector that will select
 * an element that matches a standard css selector and
 * has specific text
 *
 * @param cssSelector The standard css selector to use
 * to select the element
 * @param textSelector The text to look for
 * @returns a string that works as a playwright selector
 */
export const cssSelectorWithText = (
	cssSelector: string,
	textSelector: string
) => `${cssSelector}:has-text("${textSelector}")`;
