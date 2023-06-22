import createSheetFromFlatData from "$backend/createSheetFromFlatData";
import prisma from "$prisma";
import { SHEET_REFETCH_INTERVAL_MS } from "$root/config";
import { FullSheet } from "$sheets/types";
import { generateRandomInventorySheet } from "$tests/utils/randomGenerators";
import { test, Page } from "@playwright/test";
import { Sheet } from "@prisma/client";

type ClientName = `client${"A" | "B"}`;

type ClientFields = Record<ClientName, Page> & {
	waitForRefetch: () => Promise<void>;
};

export const testWithNewlyCreatedSheet = test
	.extend<{
		sheet: Sheet;
	}>({
		sheet: async ({}, use) => {
			const { name } = generateRandomInventorySheet();

			const createdSheet = await prisma.sheet.create({
				data: {
					name,
				},
			});

			use(createdSheet);
		},
	})
	.extend({
		page: async ({ page, sheet }, use) => {
			await page.goto(`/sheets/${sheet.id}`);

			await use(page);
		},
	});

export const testWithNewSheetNoWelcomeDialog = testWithNewlyCreatedSheet.extend(
	{
		page: async ({ page }, use) => {
			await page.getByRole("button", {
				name: "close",
			});

			await page.getByRole("button", {
				name: "save",
			});

			await page.getByRole("dialog", {
				name: "Edit Sheet Name",
			});

			await use(page);
		},
	}
);

export const testDualClientsWithNewSheet =
	testWithNewlyCreatedSheet.extend<ClientFields>({
		clientA: async ({ page, context }, use) => {
			const result = await context.newPage();
			await result.goto(page.url());
			await use(result);
		},
		clientB: async ({ page, context }, use) => {
			const result = await context.newPage();
			await result.goto(page.url());
			await use(result);
		},
		waitForRefetch: async ({ page }, use) => {
			// eslint-disable-next-line playwright/no-wait-for-timeout
			await use(() => page.waitForTimeout(SHEET_REFETCH_INTERVAL_MS));
		},
	});

type ExistingSheetFixtureProps = {
	sheet: FullSheet;
};
export const testWithExistingSheet = test.extend<ExistingSheetFixtureProps>({
	// eslint-disable-next-line no-empty-pattern
	sheet: async ({}, use) => {
		const sheet = generateRandomInventorySheet();
		const createdSheet = await createSheetFromFlatData(sheet);

		await use(createdSheet);
	},
	page: async ({ page, sheet }, use) => {
		await page.goto(`/sheets/${sheet.id}`);

		await use(page);
	},
});
