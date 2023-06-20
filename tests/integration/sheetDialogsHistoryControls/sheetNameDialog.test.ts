import { testWithNewSheetNoWelcomeDialog } from "$tests/fixtures/playwrightFixtures";
import { PlaywrightSheetPage } from "$tests/utils/PlaywrightSheetPage";

testWithNewSheetNoWelcomeDialog(
	"Sheet Name Dialog Closes on Back",
	async ({ page }) => {
		const sheetPage = new PlaywrightSheetPage(page);

		await sheetPage.sheetOptionsButton.click();

		await sheetPage.waitForDialogState("Edit Sheet Name", "visible");

		await sheetPage.goHistoryDirectionAndExpectToBeOnSheet("back");

		await sheetPage.waitForDialogState("Edit Sheet Name", "hidden");
	}
);
