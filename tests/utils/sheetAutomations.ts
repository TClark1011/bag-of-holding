import { SEARCH_BAR_DELAY_MS } from "$root/config";
import { getItemTotalValue } from "$sheets/utils";
import { searchBar, selectWithinTable } from "$tests/utils/usefulSelectors";
import wait from "$tests/utils/wait";
import { A, N, pipe, S } from "@mobily/ts-belt";
import { Page, expect, PageScreenshotOptions } from "@playwright/test";
import { Item } from "@prisma/client";
import isCI from "is-ci";

const SEARCH_BAR_INTERACTION_BUFFER_MS = isCI ? 500 : 200;

/**
 * Fill out the form used for creating/editing items
 * in a sheet
 *
 * @param client the browser context to use to execute
 * the commands to fill out the form
 * @param item The item data to fill out the form with
 */
export const fillOutItemForm = async (client: Page, item: Item) => {
	console.log("(sheetAutomations) item: ", item);

	await client.fill("#name", item.name);

	item.category && (await client.fill("#category", item.category));
	item.description && (await client.fill("#description", item.description));

	await client.fill("#quantity", `${item.quantity}`);
	await client.fill("#weight", `${item.weight}`);
	await client.fill("#value", `${item.value}`);

	item.referenceLink &&
		(await client.fill("#referenceLink", item.referenceLink));
	(await client.$("#carriedByCharacterId"))?.selectOption({
		label: item.carriedByCharacterId ?? "Nobody",
	});
};

/**
 * Check that all the fields for an inventory item
 * are visible on the page.
 *
 * @param page the browser context on which we will
 * check the visibility of the fields
 * @param item The item data to look for
 * @param expectedVisibility Whether or not we expect
 * the item fields to be visible. This lets us use
 * the function to check that an items fields are no
 * longer visible after it gets deleted or edited.
 */
export const checkItemFieldVisibility = async (
	page: Page,
	item: Item,
	expectedVisibility = true
) => {
	const itemNameIsVisible = await page.isVisible(
		`data-testid=item-row-${item.name} >> text=${item.name}`
	);
	// const itemCategoryIsVisible = await page.isVisible(`text=${item.category}`);
	const itemQuantityIsVisible = await page.isVisible(`text='${item.quantity}'`);
	const itemValueIsVisible = await page.isVisible(
		`text=${getItemTotalValue(item)}`
	);
	const itemCarrierIsVisible = await page.isVisible(
		`data-testid=item-row-${item.name} >> text=${item.carriedByCharacterId}`
	);
	[
		itemNameIsVisible,
		// itemCategoryIsVisible,
		itemQuantityIsVisible,
		itemValueIsVisible,
		itemCarrierIsVisible,
	].forEach((fieldIsVisible) =>
		expect(fieldIsVisible).toBe(expectedVisibility)
	);
};

/**
 * A shorthand for `page.screenshot` that provides
 * reasonable defaults for the screenshot options
 *
 * @param client The browser context to use to take
 * the screenshot
 * @param fileName The name to give the screenshot
 * file
 * @param extraOptions Any extra options to pass to
 * `page.screenshot`
 */
export const screenshot = async (
	client: Page,
	fileName: string,
	extraOptions: Omit<PageScreenshotOptions, "path"> = {}
) => {
	// No screenshots in continious integration
	if (process.env.CI) return;
	await client.screenshot({
		path: `screenshots/${Date.now()}--${S.replaceAll(fileName, " ", "_")}.png`,
		...extraOptions,
	});
};

/**
 * Make a browser wait for a modal to close
 *
 * @param client The client that has the modal
 * we are waiting for
 * @param expectedState What state we wait for
 * the modal to be in
 * @param text Optional text to look for in the
 * modal
 */
export const waitForModalState = async (
	client: Page,
	expectedState: "attached" | "detached" | "visible" | "hidden",
	text?: string
) => {
	await client
		.locator("data-testid=dialog-content", {
			hasText: text,
		})
		.waitFor({
			state: expectedState,
		});
};

/**
 * Open the menu to edit an item by clicking on
 * its row in the items table
 *
 * @param client The browser context to use to
 * open the menu
 * @param item The item for which to open the menu
 */
export const openItemEditMenu = async (client: Page, item: Item) => {
	await client.click(`data-testid=item-row-${item.name}`);
	await waitForModalState(client, "visible");
};

/**
 * Count the number of rows in the item table, does
 * not count the header row or the totals row at the
 * bottom
 *
 * @param client The client to use
 */
export const countItemRows = async (client: Page) =>
	pipe(
		await client.$$(selectWithinTable("tbody >> tr")),
		A.length,
		N.subtract(1)
	);

/**
 * Fill the search bar in a sheet
 *
 * @param client The client to use to fill the
 * sheet
 * @param searchTerm The search term to use
 * to fill the search bar
 */
export const fillSearchBar = async (client: Page, searchTerm: string) => {
	await client.fill(searchBar, searchTerm);
	await wait(SEARCH_BAR_DELAY_MS + SEARCH_BAR_INTERACTION_BUFFER_MS);
};

export const clearSearchbar = async (client: Page) => {
	await client.focus(searchBar);
	await client.keyboard.press("Meta+A");
	await client.keyboard.press("Backspace");
	await wait(SEARCH_BAR_DELAY_MS + SEARCH_BAR_INTERACTION_BUFFER_MS);
};

/**
 * Helper for executing identical actions across multiple
 * clients
 *
 * @param clients An array of clients on which to execute
 * actions
 * @param callback The action to execute on each client.
 */
export const performActionOnMultipleClients = <T>(
	clients: Page[],
	callback: (p: Page, index: number) => Promise<T>
) => Promise.all(clients.map(callback));

/**
 * Return the name of the item in the given row
 * number
 *
 * @param client The client to use
 * @param index The index of the item row to get.
 * Wraps around if out of bounds, eg; pass -1 to get
 * the last item.
 */
export const getNameOfItemInTableAtRowIndex = async (
	client: Page,
	index: number
) =>
	pipe(
		await client.innerText(
			selectWithinTable(
				// `tbody >> tr >> nth=${index} >> td[data-column=\"name\"]`
				`tbody >> tr:has(td[data-column="name"]) >> nth=${index} >> td[data-column="name"]`
			)
		),
		S.trim
	);

/**
 * Fetch the title displayed on a sheet
 *
 * @param client The client to use
 * @returns The displayed title of the sheet. If title
 * (the first h2 element found on the sheet) is not
 * found, an error is thrown.
 */
export const getSheetTitle = (client: Page) => client.innerText("h2");

export const waitABit = () => wait(100);
