import { SHEET_REFETCH_INTERVAL_MS } from "$root/config";
import { Locator, Page, expect } from "@playwright/test";
import { Item } from "@prisma/client";
import { LiteralUnion } from "type-fest";

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

type ColumnLabel =
	| "Name"
	| "Quantity"
	| "Weight"
	| "Carried By"
	| "Category"
	| "Value";

export type HistoryDirection = "forward" | "back";

type ItemQuickMenuOption =
	| "Delete"
	| "Edit"
	| "Give To..."
	| "Add 1"
	| "Remove 1";

export type ItemFormFields = Pick<Item, "name"> &
	Partial<Omit<Item, "id" | "carriedByCharacterId" | "sheetId">> & {
		carriedBy?: string;
	};

export class PlaywrightSheetPage {
	readonly page: Page;
	readonly searchBar: Locator;
	readonly sheetOptionsButton: Locator;
	readonly itemsTable: Locator;
	readonly addItemButton: Locator;
	readonly addCharacterButton: Locator;
	readonly resetFiltersButton: Locator;

	readonly selectors = {
		spinner: ".chakra-spinner",
	};

	constructor(page: Page) {
		this.page = page;
		this.searchBar = page.locator('input[placeholder="Search"]');
		this.sheetOptionsButton = page.locator("#options-button");
		this.itemsTable = page.locator("#items-table");
		this.addItemButton = page.locator("button:text('Add New Item')");
		this.addCharacterButton = page.locator("button:text('Add Character')");
		this.resetFiltersButton = page.getByRole("button", {
			name: "Reset Filters",
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

	/**
	 * NOTE: This method assumes that the item's "carriedByCharacterId"
	 * actually contains the name of the character, not the id.
	 */
	async fillOutItemForm({ carriedBy, ...item }: ItemFormFields) {
		const pairs = Object.entries(item);

		for (const [key, value] of pairs) {
			if (value) {
				await this.page.fill(`#${key}`, value.toString());
			}
		}

		if (carriedBy) {
			await this.page.locator("#carriedByCharacterId").selectOption({
				label: carriedBy,
			});
		}
	}

	async createItem(item: ItemFormFields) {
		await this.addItemButton.click();
		await this.waitForDialogState("Create Item", "visible");
		await this.fillOutItemForm(item);
		await this.clickSaveButton("Create");
		await this.waitForDialogState("Create Item", "hidden");
	}

	getItemTableRow(itemName: string) {
		return this.itemsTable.locator("tr", {
			has: this.page.locator(`td[data-column="name"]:has-text("${itemName}")`),
		});
	}

	async getItemTableRowColumnValue(
		itemName: string,
		property: keyof Omit<Item, "id" | "sheetId">
	): Promise<string> {
		const row = await this.getItemTableRow(itemName);

		return row.locator(`td[data-column="${property}"]`).innerText();
	}

	clickItemQuickMenuButton(itemName: string) {
		const itemRow = this.getItemTableRow(itemName);

		return itemRow.getByTestId("item-quick-menu-button").click();
	}

	getSpecificItemQuickMenu(itemName: string) {
		return this.page.locator(`[data-for-item="${itemName}"]`);
	}

	getOpenItemQuickMenu() {
		return this.page.getByRole("menu", {
			name: "Item Quick Menu",
		});
	}

	getOpenItemQuickMenuOption(option: ItemQuickMenuOption) {
		return this.getOpenItemQuickMenu().getByRole("menuitem", {
			name: option,
		});
	}

	clickItemQuickMenuOption(option: ItemQuickMenuOption) {
		return this.getOpenItemQuickMenuOption(option).click();
	}

	getTagForCharacterWithName(characterName: string) {
		return this.page.locator("button.character-tag", {
			hasText: characterName,
		});
	}

	composeCharacterDeletionDialogName(characterName: string) {
		return `Remove "${characterName}" from sheet?`;
	}

	composeStandaloneItemDeleteConfirmationDialogName(itemName: string) {
		return `Delete "${itemName}"?`;
	}

	composeStandaloneGiveItemDialogName(itemName: string) {
		return `Give "${itemName}" to...`;
	}

	expectToBeOnSheet() {
		return expect(this.page.locator("#items-table")).toBeAttached();
	}

	clickModalCloseButton() {
		return this.page.locator(".chakra-modal__close-btn").click();
	}

	async goHistoryDirectionAndExpectToBeOnSheet(direction: HistoryDirection) {
		if (direction === "forward") {
			await this.page.goForward();
		} else {
			await this.page.goBack();
		}
		await this.expectToBeOnSheet();
	}

	async createCharacter(characterName: string) {
		await this.addCharacterButton.click();
		await this.waitForDialogState("Create Character", "visible");
		await this.page.fill("#name", characterName);
		await this.clickSaveButton("Save");
		await this.waitForDialogState("Create Character", "hidden");
	}

	clickColumnSortButton(column: ColumnLabel) {
		return this.itemsTable
			.locator("thead")
			.getByRole("button", {
				name: column,
			})
			.click();
	}

	async getNameOfItemAtRowIndex(rowIndex: number) {
		const rawText = await this.itemsTable
			.locator(
				`tbody >> tr:has(td[data-column="name"]) >> nth=${rowIndex} >> td[data-column="name"]`
			)
			.innerText();

		return rawText.trim();
	}

	countItemRowsCarriedByCharacter(characterName: string): Promise<number> {
		return this.itemsTable
			.locator(
				`tbody >> tr:has(td[data-column="carriedByCharacterId"]:has-text("${characterName}"))`
			)
			.count();
	}

	async countItemRows(): Promise<number> {
		const numberOfRowsWithFooter = await this.itemsTable
			.locator("tbody >> tr")
			.count();

		return numberOfRowsWithFooter - 1;
	}
}
