import {
	testWithExistingSheet,
	testWithNewSheetNoWelcomeDialog,
} from "$tests/fixtures/playwrightFixtures";
import { PlaywrightSheetPage } from "$tests/utils/PlaywrightSheetPage";
import { expect } from "@playwright/test";

testWithNewSheetNoWelcomeDialog(
	"New Character Dialog Closes on Back",
	async ({ page }) => {
		const sheetPage = new PlaywrightSheetPage(page);

		await sheetPage.addCharacterButton.click();

		await sheetPage.waitForDialogState("Create Character", "visible");

		await sheetPage.goHistoryDirectionAndExpectToBeOnSheet("back");

		await sheetPage.waitForDialogState("Create Character", "hidden");
	}
);

testWithExistingSheet(
	"Edit Character Dialog Closes on Back",
	async ({ page, sheet }) => {
		const sheetPage = new PlaywrightSheetPage(page);

		const characterToEdit = sheet.characters[0];

		await sheetPage.getTagForCharacterWithName(characterToEdit.name).click();

		await sheetPage.waitForDialogState(characterToEdit.name, "visible");

		await sheetPage.goHistoryDirectionAndExpectToBeOnSheet("back");

		await sheetPage.waitForDialogState(characterToEdit.name, "hidden");
	}
);

testWithExistingSheet(
	"Character Delete Confirmation Dialog Closes on Back",
	async ({ page, sheet }) => {
		const sheetPage = new PlaywrightSheetPage(page);

		const characterToEdit = sheet.characters[0];

		await sheetPage.getTagForCharacterWithName(characterToEdit.name).click();

		await sheetPage.waitForDialogState(characterToEdit.name, "visible");

		await page.locator("button:text('Delete')").click();
		const titleOfDeleteConfirmationDialog =
			sheetPage.composeCharacterDeletionDialogName(characterToEdit.name);

		await sheetPage.waitForDialogState(
			titleOfDeleteConfirmationDialog,
			"visible"
		);

		await sheetPage.goHistoryDirectionAndExpectToBeOnSheet("back");

		await sheetPage.waitForDialogState(characterToEdit.name, "hidden");
		await sheetPage.waitForDialogState(
			titleOfDeleteConfirmationDialog,
			"hidden"
		);

		// Now we re-open the character edit dialog and confirm that the
		// delete confirmation dialog is still hidden

		await sheetPage.getTagForCharacterWithName(characterToEdit.name).click();

		await sheetPage.waitForDialogState(characterToEdit.name, "visible");

		await expect(
			await sheetPage.getDialog(titleOfDeleteConfirmationDialog)
		).toBeHidden();
	}
);
