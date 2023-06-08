import { testWithExistingSheet } from "$tests/fixtures/playwrightFixtures";
import { test } from "@playwright/test";

test.describe("Item Dialog Cancel", () => {
	testWithExistingSheet("While Creating Item", async ({ page }) => {
		await page.click("text=Add New Item");

		await page
			.getByRole("dialog", {
				name: "Create Item",
			})
			.waitFor({
				state: "visible",
			});

		await page.click("button:text('Cancel')");

		await page
			.getByRole("dialog", {
				name: "Create Item",
			})
			.waitFor({
				state: "hidden",
			});
	});

	testWithExistingSheet("While Editing Item", async ({ page }) => {
		await page.click("text=Add New Item");

		await page
			.getByRole("dialog", {
				name: "Create Item",
			})
			.waitFor({
				state: "visible",
			});

		await page
			.getByRole("textbox", {
				name: "name",
			})
			.type("Test Item");

		await page.click("button:text('Create')");

		await page
			.getByRole("dialog", {
				name: "Create Item",
			})
			.waitFor({
				state: "hidden",
			});

		await page.click("text=Test Item");

		await page
			.getByRole("dialog", {
				name: "Create Item",
			})
			.waitFor({
				state: "visible",
			});

		await page.click("button:text('Cancel')");

		await page
			.getByRole("dialog", {
				name: "Create Item",
			})
			.waitFor({
				state: "hidden",
			});
	});
});
