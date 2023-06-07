import { testWithExistingSheet } from "$tests/fixtures/playwrightFixtures";
import { expect, test } from "@playwright/test";

test.describe("Maintenance Mode", () => {
	test("Get Started Links Are Hidden", async ({ page }) => {
		await page.goto("/");

		await expect(await page.locator("button:text('Get Started')")).toBeHidden();

		await page.click("text=What is this?");

		await page.waitForURL("**/info");

		await expect(await page.locator("button:text('Get Started')")).toBeHidden();
	});

	testWithExistingSheet(
		"Sheet Page Redirects to Home",
		async ({ sheet, baseURL, page }) => {
			await page.goto(`/sheets/${sheet.id}`);

			expect(await page.url()).not.toContain("/sheets/");

			await page.waitForURL(baseURL ?? "");
		}
	);
});
