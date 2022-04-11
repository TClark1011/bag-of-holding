/* eslint-disable jsdoc/require-jsdoc */
import { SheetModel } from "$backend/models";
import { connectToMongoose } from "$backend/utils";
import { InventorySheetFields } from "$sheets/types";
import { generateRandomInventorySheet } from "$tests/utils/randomGenerators";
import { test, Page } from "@playwright/test";
import mongoose from "mongoose";

type ClientName = `client${"A" | "B"}`;

type ClientFields = Record<ClientName, Page> & {
	waitForRefetch: () => Promise<void>;
};

const testNewlyCreatedSheet = test.extend({
	page: async ({ page }, use) => {
		await connectToMongoose();
		const { name } = generateRandomInventorySheet();

		const createdSheet = await new SheetModel({
			name,
		}).save();

		await page.goto(`sheets/${createdSheet._id}`);
		await use(page);
		await mongoose.disconnect();
	},
});

export const testWithNewSheet = testNewlyCreatedSheet.extend<ClientFields>({
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
		await use(() => page.waitForTimeout(3000));
	},
});

type ExistingSheetFixtureProps = {
	sheet: InventorySheetFields;
};
export const testWithExistingSheet = test.extend<ExistingSheetFixtureProps>({
	// eslint-disable-next-line no-empty-pattern
	sheet: async ({}, use) => {
		await connectToMongoose();

		const { _id, ...sheet } = generateRandomInventorySheet();
		const createdSheet = await new SheetModel(sheet).save();

		await use(createdSheet);

		await mongoose.disconnect();
	},
	page: async ({ page, sheet }, use) => {
		await page.goto(`/sheets/${sheet._id}`);

		await use(page);
	},
});
