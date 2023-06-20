import { SHEET_REFETCH_INTERVAL_MS } from "$root/config";
import { Locator, Page, expect } from "@playwright/test";
import { Item } from "@prisma/client";
import { LiteralUnion, SetRequired } from "type-fest";

type DialogTitle = LiteralUnion<
	| "Edit Sheet Name"
	| "Create Item"
	| "Edit Item"
	| "Create Character"
	| "Welcome!"
	| "Confirm Delete",
	string
>;

type VisibilityState = "visible" | "hidden";

type SaveButtonText = "Save" | "Create";

type ColumnLabel = "Name" | "Quantity" | "Weight" | "Carried By" | "Category";

export type HistoryDirection = "forward" | "back";

export class PlaywrightSheetPage {
	readonly page: Page;
	readonly searchBar: Locator;
	readonly sheetOptionsButton: Locator;
	readonly itemsTable: Locator;
	readonly addItemButton: Locator;
	readonly addCharacterButton: Locator;

	constructor(page: Page) {
		this.page = page;
		this.searchBar = page.locator('input[placeholder="Search"]');
		this.sheetOptionsButton = page.locator("#options-button");
		this.itemsTable = page.locator("#items-table");
		this.addItemButton = page.locator("button:text('Add New Item')");
		this.addCharacterButton = page.locator("button:text('Add Character')");
	}

	/**
	 * NOTE: This method assumes that the item's "carriedByCharacterId"
	 * actually contains the name of the character, not the id.
	 */
	async fillOutItemForm(item: SetRequired<Partial<Item>, "name">) {
		await this.page.fill("#name", item.name);

		item.category && (await this.page.fill("#category", item.category));
		item.description &&
			(await this.page.fill("#description", item.description));

		await this.page.fill("#quantity", `${item.quantity}`);
		await this.page.fill("#weight", `${item.weight}`);
		await this.page.fill("#value", `${item.value}`);

		item.referenceLink &&
			(await this.page.fill("#referenceLink", item.referenceLink));
		(await this.page.$("#carriedByCharacterId"))?.selectOption({
			label: item.carriedByCharacterId ?? "Nobody",
		});
	}

	async waitForSheetTitleToBe(title: string) {
		await this.page.waitForSelector(`h2:text('${title}')`, {
			timeout: SHEET_REFETCH_INTERVAL_MS + 200,
		});
	}

	getDialog(dialogTitle: DialogTitle) {
		return this.page.getByRole("dialog", {
			name: dialogTitle,
		});
	}

	async waitForDialogState(dialogTitle: DialogTitle, state: VisibilityState) {
		return this.getDialog(dialogTitle).waitFor({
			state,
		});
	}

	async clickSaveButton(text: SaveButtonText) {
		await this.page
			.getByRole("button", {
				name: text,
			})
			.click();
	}

	async waitForCharacterButtonToBeVisible(characterName: string) {
		await this.page.waitForSelector(
			`button.character-tag:text("${characterName}")`,
			{
				timeout: SHEET_REFETCH_INTERVAL_MS + 200,
			}
		);
	}

	getItemTableRow(itemName: string) {
		return this.itemsTable.locator("tr", {
			has: this.page.locator(`td[data-column="name"]:has-text("${itemName}")`),
		});
	}

	getTagForCharacterWithName(characterName: string) {
		return this.page.locator("button.character-tag", {
			hasText: characterName,
		});
	}

	composeCharacterDeletionDialogName(characterName: string) {
		return `Remove "${characterName}" from sheet?`;
	}

	expectToBeOnSheet() {
		return expect(this.page.locator("#items-table")).toBeAttached();
	}

	async goHistoryDirectionAndExpectToBeOnSheet(direction: HistoryDirection) {
		if (direction === "forward") {
			await this.page.goForward();
		} else {
			await this.page.goBack();
		}
		await this.expectToBeOnSheet();
	}
}
