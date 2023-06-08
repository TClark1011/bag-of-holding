import { SHEET_REFETCH_INTERVAL_MS, TESTING_ADMIN_KEY } from "$root/config";
import { FullSheet, fullSheetSchema } from "$sheets/types";
import { generateRandomInventorySheet } from "$tests/utils/randomGenerators";
import { test, Page } from "@playwright/test";
import SuperJSON from "superjson";

type ClientName = `client${"A" | "B"}`;

type ClientFields = Record<ClientName, Page> & {
	waitForRefetch: () => Promise<void>;
};

const getSheetIdFromUrl = (url: string) => {
	const urlParts = url.split("/");
	const sheetId = urlParts[urlParts.length - 1];
	return sheetId;
};

export const testSingleClientWithNewSheet = test
	.extend({
		page: async ({ page }, use) => {
			const { name } = generateRandomInventorySheet();

			await page.goto("/");
			await page.click("button:text('Get Started')");
			await page.waitForURL("/sheets/*");
			await page.click("button:text('Close')");
			await page.getByRole("textbox", { name: "name" }).fill(name);
			await page.click("button:text('Save')");
			// const createdSheet = await prisma.sheet.create({
			// 	data: {
			// 		name,
			// 	},
			// });

			await use(page);
		},
	})
	.extend<{ sheetId: string }>({
		sheetId: async ({ page }, use) => {
			await use(getSheetIdFromUrl(page.url()));
		},
	});

export const testDualClientsWithNewSheet =
	testSingleClientWithNewSheet.extend<ClientFields>({
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
export const testWithExistingSheet = test
	.extend<ExistingSheetFixtureProps>({
		// eslint-disable-next-line no-empty-pattern
		sheet: async ({ context, baseURL }, use) => {
			const page = await context.newPage();
			await page.goto("/");
			console.log(baseURL);
			const testSheetResponse = await page.evaluate(
				([baseUrl, key]) =>
					fetch(`${baseUrl}/api/get-test-sheet`, {
						headers: {
							Authorization: `Bearer: ${key}`,
						},
					}).then(
						(res) =>
							res.json() as Promise<{
								superJsonStringifiedSheet: string;
							}>
					),
				[baseURL, TESTING_ADMIN_KEY]
			);

			const { superJsonStringifiedSheet } = testSheetResponse;

			const sheet = SuperJSON.parse(superJsonStringifiedSheet);

			await use(fullSheetSchema.parse(sheet) as FullSheet);

			await page.close();
		},
	})
	.extend({
		page: async ({ page, sheet }, use) => {
			await page.goto(`/sheets/${sheet.id}`);

			await use(page);
		},
	});
