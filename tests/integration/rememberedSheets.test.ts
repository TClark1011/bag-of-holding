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

	// await page.waitForSelector(`text=${REMEMBERED_SHEETS_HEADER}`, {
	// 	state: "visible",
	// });

	// // After visiting 1 sheet, there should be 1 link
	// await expect(page.getByTestId(REMEMBERED_SHEETS_LINK_TEST_ID)).toBeVisible();

	// await page.click(`text=Get Started`);

	// await page.waitForURL("**/sheets/*");

	// await page.waitForSelector("text=New Sheet", {
	// 	state: "visible",
	// });

	// await page.waitForTimeout(150);

	// await page.goto("/");

	// await page.waitForSelector(`text=${REMEMBERED_SHEETS_HEADER}`, {
	// 	state: "visible",
	// });

	// const a = await page.getByTestId(REMEMBERED_SHEETS_LINK_TEST_ID).all();

	// await expect(
	// 	await page.getByTestId(REMEMBERED_SHEETS_LINK_TEST_ID).all()
	// ).toHaveLength(2);

	// await page.click(`text=Get Started`);

	// await page.waitForURL("**/sheets/*");

	// await page.waitForSelector("text=New Sheet", {
	// 	state: "visible",
	// });

	// await page.waitForTimeout(150);

	// await page.goto("/");

	// await page.waitForSelector(`text=${REMEMBERED_SHEETS_HEADER}`, {
	// 	state: "visible",
	// });

	// await expect(
	// 	await page.getByTestId(REMEMBERED_SHEETS_LINK_TEST_ID).all()
	// ).toHaveLength(3);

	// await page.click(`text=Get Started`);

	// await page.waitForURL("**/sheets/*");

	// await page.waitForSelector("text=New Sheet", {
	// 	state: "visible",
	// });

	// await page.waitForTimeout(150);

	// await page.goto("/");

	// await page.waitForSelector(`text=${REMEMBERED_SHEETS_HEADER}`, {
	// 	state: "visible",
	// });

	// await expect(
	// 	await page.getByTestId(REMEMBERED_SHEETS_LINK_TEST_ID).all()
	// ).toHaveLength(4);

	// await page.click(`text=Get Started`);

	// await page.waitForURL("**/sheets/*");

	// await page.waitForSelector("text=New Sheet", {
	// 	state: "visible",
	// });

	// await page.waitForTimeout(150);

	// await page.goto("/");

	// await page.waitForSelector(`text=${REMEMBERED_SHEETS_HEADER}`, {
	// 	state: "visible",
	// });

	// // Even after 5th sheet, only 4 links should be visible
	// await expect(
	// 	await page.getByTestId(REMEMBERED_SHEETS_LINK_TEST_ID).all()
	// ).toHaveLength(4);

	// await page.getByTestId(REMEMBERED_SHEETS_LINK_TEST_ID).first().click();

	// await page.waitForURL("**/sheets/*");
});
