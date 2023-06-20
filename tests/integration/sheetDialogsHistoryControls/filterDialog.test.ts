import { testWithExistingSheet } from "$tests/fixtures/playwrightFixtures";
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
