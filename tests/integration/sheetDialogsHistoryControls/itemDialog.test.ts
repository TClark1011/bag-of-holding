import {
	testWithExistingSheet,
	testWithNewSheetNoWelcomeDialog,
} from "$tests/fixtures/playwrightFixtures";
import { PlaywrightSheetPage } from "$tests/utils/PlaywrightSheetPage";
import { A } from "@mobily/ts-belt";
import { expect } from "@playwright/test";

testWithNewSheetNoWelcomeDialog(
	"New Item Dialog Closes on Back",
	async ({ page }) => {
		const sheetPage = new PlaywrightSheetPage(page);

		await sheetPage.addItemButton.click();

		await sheetPage.waitForDialogState("Create Item", "visible");

		await sheetPage.goHistoryDirectionAndExpectToBeOnSheet("back");

		await sheetPage.waitForDialogState("Create Item", "hidden");
	}
);

testWithExistingSheet(
	"Edit Item Dialog Closes on Back",
	async ({ page, sheet }) => {
		const sheetPage = new PlaywrightSheetPage(page);

		const itemToEdit = A.sortBy(sheet.items, (item) => item.name)[0];
		// Use the first item sorting alphabetically to make sure it is within
		// the viewport

		await sheetPage.getItemTableRow(itemToEdit.name).click();

		await sheetPage.waitForDialogState("Edit Item", "visible");

		await sheetPage.goHistoryDirectionAndExpectToBeOnSheet("back");

		await sheetPage.waitForDialogState("Edit Item", "hidden");
	}
);

testWithExistingSheet(
	"Item Delete Confirmation Dialog Closes on Back",
	async ({ page, sheet }) => {
		const sheetPage = new PlaywrightSheetPage(page);

		const itemToEdit = sheet.items[0];

		await sheetPage.getItemTableRow(itemToEdit.name).click();

		await sheetPage.waitForDialogState("Edit Item", "visible");

		await page.locator("button:text('Delete')").click();

		await sheetPage.waitForDialogState("Confirm Delete", "visible");

		await sheetPage.goHistoryDirectionAndExpectToBeOnSheet("back");

		await sheetPage.waitForDialogState("Edit Item", "hidden");
		await sheetPage.waitForDialogState("Confirm Delete", "hidden");

		// Now we re-open the character edit dialog and confirm that the
		// delete confirmation dialog is still hidden

		await sheetPage.getItemTableRow(itemToEdit.name).click();

		await sheetPage.waitForDialogState("Edit Item", "visible");

		await expect(await sheetPage.getDialog("Confirm Delete")).toBeHidden();
	}
);
