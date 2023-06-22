import { PlaywrightSheetPage } from "$tests/utils/PlaywrightSheetPage";
import { expect, test } from "@playwright/test";
import prisma from "$prisma";
import { Sheet } from "@prisma/client";

const ITEM_NAME = "Item A";
const CHARACTER_NAME = "Character A";

test.describe.configure({
	mode: "serial",
});

let sheet: Sheet;
let sheetPage: PlaywrightSheetPage;

test.beforeAll(async ({ browser }) => {
	sheet = await prisma.sheet.create({
		data: {
			name: "A Sheet",
			items: {
				create: [
					{
						name: ITEM_NAME,
						quantity: 1,
					},
				],
			},
		},
	});
	const page = await browser.newPage();

	await page.goto(`/sheets/${sheet.id}`);

	sheetPage = new PlaywrightSheetPage(page);
});

test.afterAll(async () => {
	await sheetPage.page.close();
});

test("Edit Button", async () => {
	await sheetPage.clickItemQuickMenuButton(ITEM_NAME);
	await sheetPage.getSpecificItemQuickMenu(ITEM_NAME).waitFor({
		state: "visible",
	});

	await sheetPage.clickItemQuickMenuOption("Edit");
	await sheetPage.getSpecificItemQuickMenu(ITEM_NAME).waitFor({
		state: "hidden",
	});

	await sheetPage.waitForDialogState("Edit Item", "visible");
	await sheetPage.clickModalCloseButton();
	await sheetPage.waitForDialogState("Edit Item", "hidden");
});

test("Add/Remove Buttons", async () => {
	await sheetPage.clickItemQuickMenuButton(ITEM_NAME);
	await sheetPage.clickItemQuickMenuOption("Remove 1");
	await sheetPage
		.getOpenItemQuickMenuOption("Remove 1")
		.locator(sheetPage.selectors.spinner)
		.waitFor({
			state: "visible",
		}); // expect loading spinner on button

	await sheetPage.getSpecificItemQuickMenu(ITEM_NAME).waitFor({
		state: "hidden",
	});

	const quantityAfterRemove1 = await sheetPage.getItemTableRowColumnValue(
		ITEM_NAME,
		"quantity"
	);

	expect(quantityAfterRemove1).toBe("0");

	await sheetPage.clickItemQuickMenuButton(ITEM_NAME);

	const remove1Button = await sheetPage.getOpenItemQuickMenuOption("Remove 1");

	await expect(remove1Button).toBeDisabled();

	await sheetPage.clickItemQuickMenuOption("Add 1");
	await sheetPage
		.getOpenItemQuickMenuOption("Add 1")
		.locator(sheetPage.selectors.spinner)
		.waitFor({
			state: "visible",
		}); // expect loading spinner on button

	await sheetPage.getSpecificItemQuickMenu(ITEM_NAME).waitFor({
		state: "hidden",
	});

	const quantityAfterAdd1 = await sheetPage.getItemTableRowColumnValue(
		ITEM_NAME,
		"quantity"
	);

	expect(quantityAfterAdd1).toBe("1");
});

test("'Give To' Button", async () => {
	await sheetPage.clickItemQuickMenuButton(ITEM_NAME);

	const giveDialogName =
		sheetPage.composeStandaloneGiveItemDialogName(ITEM_NAME);

	const giveToButton = sheetPage.getOpenItemQuickMenuOption("Give To...");
	await expect(giveToButton).toBeDisabled(); // Give to is disabled when no characters exist

	await sheetPage.createCharacter(CHARACTER_NAME);

	await sheetPage.clickItemQuickMenuButton(ITEM_NAME);
	await sheetPage.clickItemQuickMenuOption("Give To...");

	await sheetPage.waitForDialogState(giveDialogName, "visible");
	await sheetPage.getDialog(giveDialogName).getByText(CHARACTER_NAME).click();

	await sheetPage.page
		.getByRole("button", {
			name: "Give",
		})
		.click();

	await sheetPage.waitForDialogState(giveDialogName, "hidden");

	expect(
		await sheetPage.getItemTableRowColumnValue(
			ITEM_NAME,
			"carriedByCharacterId"
		)
	).toBe(CHARACTER_NAME);

	await sheetPage.clickItemQuickMenuButton(ITEM_NAME);
	await sheetPage.clickItemQuickMenuOption("Give To...");

	await sheetPage.waitForDialogState(giveDialogName, "visible");
	await sheetPage.getDialog(giveDialogName).getByText("Nobody").click();
	await sheetPage.page
		.getByRole("button", {
			name: "Give",
		})
		.click();

	await sheetPage.waitForDialogState(giveDialogName, "hidden");

	expect(
		await sheetPage.getItemTableRowColumnValue(
			ITEM_NAME,
			"carriedByCharacterId"
		)
	).toBe("");
});

// Delete test must be last because the page context is persistent
// across tests.
test("Delete Button", async () => {
	const itemTableRow = await sheetPage.getItemTableRow(ITEM_NAME);

	await sheetPage.clickItemQuickMenuButton(ITEM_NAME);

	await sheetPage.clickItemQuickMenuOption("Delete");
	await sheetPage.getSpecificItemQuickMenu(ITEM_NAME).waitFor({
		state: "hidden",
	});

	const deleteDialogName =
		sheetPage.composeStandaloneItemDeleteConfirmationDialogName(ITEM_NAME);

	await sheetPage.waitForDialogState(deleteDialogName, "visible");

	await sheetPage.page
		.getByRole("button", {
			name: "Delete",
		})
		.click();

	await sheetPage.page
		.getByRole("button", {
			name: "Delete",
			disabled: true,
		})
		.locator(sheetPage.selectors.spinner)
		.waitFor({
			state: "visible",
		}); // expect delete button spinner

	await sheetPage.waitForDialogState(deleteDialogName, "hidden");

	expect(itemTableRow).not.toBeAttached();
});
