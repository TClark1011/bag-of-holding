import { screenshot } from "$tests/utils/sheetAutomations";
import test, { expect } from "@playwright/test";

const REMEMBERED_SHEETS_HEADER = "Recently Visited Sheets";
const REMEMBERED_SHEETS_LINK_TEST_ID = "remembered-sheet-link";

const SHEET_NAMES = ["a", "b", "c", "d", "e"] as const;
// const SHEET_NAMES = ["a"] as const;

test("Remembered Sheets", async ({ page }) => {
	await page.goto("/");

	await expect(page.getByText(REMEMBERED_SHEETS_HEADER)).toBeHidden();

	for (let i = 0; i < SHEET_NAMES.length; i++) {
		const sheetName = SHEET_NAMES[i];

		await page.click(`text=Get Started`);

		await page.waitForURL("**/sheets/*");

		await page.click("button:text('Close')");

		await page
			.getByRole("textbox", {
				name: "name",
			})
			.fill(sheetName);

		await page.click("button:text('Save')");

		await expect(
			page.getByRole("dialog", { name: "Edit Sheet Name" })
		).toBeHidden();

		await page.goto("/");

		await page.waitForSelector(`text=${REMEMBERED_SHEETS_HEADER}`, {
			state: "visible",
		});

		await expect(
			await page.getByTestId(REMEMBERED_SHEETS_LINK_TEST_ID).all()
		).toHaveLength(Math.min(i + 1, 4));

		const firstElement = await page
			.getByTestId(REMEMBERED_SHEETS_LINK_TEST_ID)
			.first();

		await screenshot(page, `returned-home-#${i + 1}`);

		expect(await firstElement.textContent()).toBe(sheetName);

		await page
			.getByTestId(REMEMBERED_SHEETS_LINK_TEST_ID)
			.filter({
				hasText: sheetName,
			})
			.click();

		await page.waitForURL("**/sheets/*");

		const sheetTitleElement = await page.waitForSelector("#sheet-title");
		expect(await sheetTitleElement.textContent()).toBe(sheetName);

		await page.goto("/");
	}
});
