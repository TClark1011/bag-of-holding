import { testSingleClientWithNewSheet } from "$tests/fixtures/playwrightFixtures";
import { expect, test } from "@playwright/test";

test.describe("Maintenance Mode", () => {
	test("Get Started Links Are Hidden", async ({ page }) => {
		await page.goto("/");

		await expect(await page.locator("button:text('Get Started')")).toBeHidden();

		await page.click("text=What is this?");

		await page.waitForURL("**/info");

		await expect(await page.locator("button:text('Get Started')")).toBeHidden();
	});

	testSingleClientWithNewSheet(
		"Sheet Page Redirects to Home",
		async ({ sheetId, baseURL, page }) => {
			await page.goto(`/sheets/${sheetId}`);

			expect(await page.url()).not.toContain("/sheets/");

			await page.waitForURL(baseURL ?? "");
		}
	);
});
