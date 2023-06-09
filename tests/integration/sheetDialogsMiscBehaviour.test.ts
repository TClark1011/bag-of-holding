import {
	testWithExistingSheet,
	testWithNewSheetNoWelcomeDialog,
} from "$tests/fixtures/playwrightFixtures";
import { test } from "@playwright/test";

test.describe("Filter Dialog Closes With Back Button", () => {
	testWithExistingSheet("Desktop", async ({ page }) => {
		// Narrow the screen enough to get the filters button to show
		// but not enough to get the mobile view
		page.setViewportSize({
			width: 900,
			height: 800,
		});

		await page.click("button:text('Filters')");

		await page
			.getByRole("dialog", {
				name: "Filters",
			})
			.waitFor({
				state: "visible",
			});

		await page.goBack();

		await page
			.getByRole("dialog", {
				name: "Filters",
			})
			.waitFor({
				state: "hidden",
			});

		// Make sure going back did not navigate away from the page
		await page.waitForURL("**/sheets/*");
	});

	testWithExistingSheet("Mobile", async ({ page }) => {
		// Go to mobile view
		page.setViewportSize({
			width: 400,
			height: 800,
		});

		await page.click("button:text('Filters')");

		await page
			.getByRole("dialog", {
				name: "Filters",
			})
			.waitFor({
				state: "visible",
			});

		await page.goBack();

		await page
			.getByRole("dialog", {
				name: "Filters",
			})
			.waitFor({
				state: "hidden",
			});

		// Make sure going back did not navigate away from the page
		await page.waitForURL("**/sheets/*");
	});
});

test.describe("Can Cancel Item Dialog", () => {
	testWithNewSheetNoWelcomeDialog("Creating Item", async ({ page }) => {
		await page.click("text=Add New Item");

		await page.click("button:text('Cancel')");

		await page
			.getByRole("dialog", {
				name: "Create Item",
			})
			.waitFor({
				state: "hidden",
			});
	});

	testWithExistingSheet("Editing Item", async ({ page }) => {
		// Just click on the first item in the table to open the
		// edit item dialog
		await page.locator("table >> tbody >> tr").first().click();

		await page
			.getByRole("dialog", {
				name: "Edit Item",
			})
			.waitFor({
				state: "visible",
			});

		await page.click("button:text('Cancel')");

		await page
			.getByRole("dialog", {
				name: "Edit Item",
			})
			.waitFor({
				state: "hidden",
			});
	});
});

testWithNewSheetNoWelcomeDialog(
	"Can Cancel Sheet Name Dialog",
	async ({ page }) => {
		await page
			.getByRole("button", {
				name: "edit sheet name",
			})
			.click();

		await page
			.getByRole("dialog", {
				name: "Edit Sheet Name",
			})
			.waitFor({
				state: "visible",
			});

		await page.click("button:text('Cancel')");

		await page
			.getByRole("dialog", {
				name: "Edit Sheet Name",
			})
			.waitFor({
				state: "hidden",
			});
	}
);
