import { NonEmptyArray } from "$root/types";
import { takeRandom } from "$root/utils";
import { Item } from "@prisma/client";
import { getItemTotalValue, searchComparison } from "$sheets/utils";
import {
	testDualClientsWithNewSheet,
	testWithExistingSheet,
} from "$tests/fixtures/playwrightFixtures";
import getMostCommonLetterCombo from "$tests/utils/getMostCommonLetterCombo";
import { generateRandomInventoryItem } from "$tests/utils/randomGenerators";
import {
	clearSearchbar,
	countItemRows,
	fillSearchBar,
	getNameOfItemInTableAtRowIndex,
	getSheetTitle,
	performActionOnMultipleClients,
	waitABit,
} from "$tests/utils/sheetAutomations";
import {
	characterDialogSaveButton,
	columnFilterButton,
	cssSelectorWithText,
	openPopover,
	selectWithinColumnHeader,
	sheetAddCharacterButton,
	sheetCharacterTag,
	sheetNewItemButton,
	sheetNewItemSaveButton,
	sheetOptionsButton,
} from "$tests/utils/usefulSelectors";
import wait from "$tests/utils/wait";
import { A, D, F, flow, pipe, S } from "@mobily/ts-belt";
import test, { expect } from "@playwright/test";
import { SHEET_REFETCH_INTERVAL_MS } from "$root/config";
import { PlaywrightSheetPage } from "$tests/utils/PlaywrightSheetPage";

testDualClientsWithNewSheet.describe.configure({
	mode: "parallel",
});

const shortRandomString = () => Math.random().toString().slice(2, 8);

test("Create New Sheet, Close Welcome", async ({ page }) => {
	await page.goto("/");

	await page.click("text=Get Started");

	await page.waitForURL("**/sheets/*");

	await page.$("text=Welcome!");
	await page.click(cssSelectorWithText("button", "Close"));
	await page.waitForSelector("text=Edit Sheet Name");
	await page.keyboard.press("Escape");

	expect(await getSheetTitle(page)).toBe("New Sheet");
});

testDualClientsWithNewSheet(
	"Change Sheet Name",
	async ({ clientA, clientB }) => {
		await clientA.click(sheetOptionsButton);
		await clientA.waitForSelector("text=Edit Sheet Name");

		const testName = "Test Sheet Name";
		await clientA.fill("#name", testName);
		await clientA.click("text=Save");

		await clientA.waitForSelector("text=Edit Sheet Name", {
			state: "hidden",
		});

		expect(await getSheetTitle(clientA)).toBe(testName);

		await clientB.waitForSelector(`text=${testName}`, {
			timeout: 10000,
		});
	}
);

testDualClientsWithNewSheet(
	"Create Character, Give Items",
	async ({ clientA, clientB }) => {
		const nameInputSelector = "input#name";
		const characterName = shortRandomString();

		await clientA.click("text=Add Character");

		await clientA
			.getByRole("dialog", {
				name: "Create Character",
			})
			.waitFor({
				state: "visible",
			});

		await clientA.fill(nameInputSelector, characterName);
		await clientA.click("text=Save");

		await clientA
			.getByRole("dialog", {
				name: "Create Character",
			})
			.waitFor({
				state: "hidden",
			});

		await clientA.waitForSelector(`button:has-text("${characterName}")`);
		await clientB.waitForSelector(`button:has-text("${characterName}")`);

		await clientA.click("text=Add New Item");

		const itemName = shortRandomString();

		await clientA
			.getByRole("dialog", {
				name: "Create Item",
			})
			.waitFor({
				state: "visible",
			});
		await clientA.fill(nameInputSelector, itemName);
		await (
			await clientA.$("#carriedByCharacterId")
		)?.selectOption({
			label: characterName,
		});

		await clientA.click("button:text('Create')");
		await clientA
			.getByRole("dialog", {
				name: "Create Item",
			})
			.waitFor({
				state: "hidden",
			});

		await clientA.waitForSelector(
			`tr:has-text("${itemName}"):has-text("${itemName}")`
		);
		await clientB.waitForSelector(
			`tr:has-text("${itemName}"):has-text("${itemName}")`
		);
	}
);

testWithExistingSheet("Advanced Operations", async ({ page, sheet }) => {
	const sheetPage = new PlaywrightSheetPage(page);

	const sortedItemNames = pipe(
		sheet.items,
		A.sortBy(D.getUnsafe("name")),
		A.map(D.getUnsafe("name"))
	);

	// ### sort by name
	// Check default is sorting by name
	expect(await sheetPage.getNameOfItemAtRowIndex(0)).toBe(
		A.head(sortedItemNames)
	);
	await sheetPage.clickColumnSortButton("Name");

	waitABit();

	// Sorting should be reversed after clicking on the name column header
	// expect(await getNameOfItemInTable(0)).toBe(A.last(sortedItemNames));
	expect(await sheetPage.getNameOfItemAtRowIndex(0)).toBe(
		A.last(sortedItemNames)
	);

	// ### filter helpers
	const itemCategories = pipe(
		sheet.items,
		A.map(D.get("category")),
		A.uniq
	) as NonEmptyArray<string>;

	const memberToFilterOut = takeRandom(sheet.characters);

	const itemIsCarriedByFilteredOutMember: (item: Item) => boolean = flow(
		D.getUnsafe("carriedByCharacterId"),
		F.equals(memberToFilterOut?.id)
	);

	// ### filter out a single member

	// First we check that the sheet is currently showing items
	// carried by the member which we will filter out
	expect(
		memberToFilterOut
			? await sheetPage.countItemRowsCarriedByCharacter(memberToFilterOut.name)
			: null
	).toBeGreaterThan(0);

	// Click on "Carried By" column filter button
	await page.click(selectWithinColumnHeader("Carried By", columnFilterButton));
	await page.waitForSelector(openPopover);
	await page.click(`${openPopover} >> text="${memberToFilterOut?.name}"`);
	// Press escape to close popover
	await page.keyboard.press("Escape");
	// Wait for popover to be hidden
	await page.locator(openPopover).waitFor({
		state: "hidden",
	});

	const filteredAndSortedItems = pipe(
		sheet.items as Item[],
		A.reject(itemIsCarriedByFilteredOutMember),
		A.sortBy(D.get("name"))
	);
	expect(await sheetPage.countItemRows()).toBe(filteredAndSortedItems.length);
	expect(await sheetPage.getNameOfItemAtRowIndex(0)).toBe(
		A.last(filteredAndSortedItems)?.name
	);
	expect(await sheetPage.getNameOfItemAtRowIndex(-1)).toBe(
		A.head(filteredAndSortedItems)?.name
	);

	const numberOfCarriedItemRows = memberToFilterOut
		? await sheetPage.countItemRowsCarriedByCharacter(memberToFilterOut.name)
		: null;

	expect(numberOfCarriedItemRows).toBe(0);

	// ### sort by a numeric field
	const itemsSortedByValue = pipe(
		filteredAndSortedItems,
		A.sortBy(getItemTotalValue),
		A.reverse
	);
	await sheetPage.clickColumnSortButton("Value");

	waitABit();

	expect(await sheetPage.getNameOfItemAtRowIndex(0)).toBe(
		A.head(itemsSortedByValue)?.name
	);
	expect(await sheetPage.getNameOfItemAtRowIndex(-1)).toBe(
		A.last(itemsSortedByValue)?.name
	);

	await sheetPage.clickColumnSortButton("Value");

	waitABit();

	expect(await sheetPage.getNameOfItemAtRowIndex(0)).toBe(
		A.last(itemsSortedByValue)?.name
	);
	expect(await sheetPage.getNameOfItemAtRowIndex(-1)).toBe(
		A.head(itemsSortedByValue)?.name
	);

	// ### filter out a category
	// open the "Carried By" filter menu
	await page.click(selectWithinColumnHeader("Carried By", columnFilterButton));

	// ### Filter out all members
	const categoryToFilterOut = takeRandom(itemCategories);
	const itemBelongsToFilteredOutCategory = (item: Item) =>
		pipe(item, D.get("category"), F.equals(categoryToFilterOut));

	await page.click(selectWithinColumnHeader("Category", columnFilterButton));
	await page.waitForSelector(openPopover);
	await page.click(`${openPopover} >> text="${categoryToFilterOut}"`);
	await page.keyboard.press("Escape");
	await page.locator(openPopover).waitFor({
		state: "hidden",
	});

	const itemsWithCategoryFilter = A.reject(
		itemsSortedByValue,
		itemBelongsToFilteredOutCategory
	);

	expect(await sheetPage.countItemRows()).toBe(itemsWithCategoryFilter.length);

	// ### Search
	const itemNames = itemsWithCategoryFilter.map(
		D.get("name")
	) as NonEmptyArray<string>;
	// We will search for the most common 2 letter combo
	// across all the item names
	const searchQuery = getMostCommonLetterCombo(itemNames, 2);

	if (!searchQuery)
		throw new Error("Failed to find the most common letter combo");

	const itemNamesThatContainSearchQuery = itemNames.filter((val) =>
		searchComparison(val, searchQuery)
	);

	// Type search query
	await fillSearchBar(page, searchQuery);

	expect(await sheetPage.countItemRows()).toBe(
		itemNamesThatContainSearchQuery.length
	);

	// Reset the search
	await clearSearchbar(page);

	waitABit();

	expect(await sheetPage.countItemRows()).toBe(itemsWithCategoryFilter.length);

	// ### Reset all filters
	await page.click("text=Reset Filters");
	waitABit();
	expect(await sheetPage.countItemRows()).toBe(sheet.items.length);
});

// testWithNewSheet(
// 	"Advanced 2 client interactions",
// 	async ({ clientA, clientB, context, waitForRefetch }) => {
// 		// # SHEET OPTIONS

// 		// ## Edit Basic Sheet Options
// 		await clientB.click(sheetOptionsButton);

// 		// Wait for modal to appear
// 		await waitForModalState(clientB, "visible");

// 		await clientB.fill("#name", updatedSheetName);
// 		await clientB.click(sheetOptionsAddMemberButton);
// 		await clientB.click(sheetOptionsAddMemberButton);
// 		await clientB.fill("[name='characters.0.name']", updatedMemberName);
// 		await clientB.fill("[name='characters.1.name']", secondMemberName);
// 		await clientB.click("text=Save");

// 		await waitForModalState(clientB, "hidden");

// 		// check sheet title matches
// 		expect(await getSheetTitle(clientB)).toBe(updatedSheetName);
// 		// first members name
// 		expect(
// 			await clientB.isVisible(
// 				`[data-testid="member-tag"]:has-text("${updatedMemberName}")`
// 			)
// 		).toBeTruthy();
// 		// second members name
// 		expect(
// 			await clientB.isVisible(
// 				`[data-testid="member-tag"]:has-text("${secondMemberName}")`
// 			)
// 		).toBeTruthy();

// 		await waitForRefetch();

// 		expect(await getSheetTitle(clientA)).toBe(updatedSheetName);
// 		expect(
// 			await clientA.isVisible(
// 				`[data-testid="member-tag"]:has-text("${updatedMemberName}")`
// 			)
// 		).toBeTruthy();

// 		expect(
// 			await clientA.isVisible(
// 				`[data-testid="member-tag"]:has-text("${secondMemberName}")`
// 			)
// 		).toBeTruthy();

// 		// # INVENTORY ITEMS
// 		const item = generateRandomInventoryItem({
// 			referenceLink: appGitLink,
// 			carriedByCharacterId: updatedMemberName,
// 		});
// 		const updatedItem = generateRandomInventoryItem({
// 			carriedByCharacterId: secondMemberName,
// 		});

// 		// ## Creating An Item
// 		await clientA.click("data-testid=add-item-button");
// 		// waiting for new item modal to open
// 		await waitForModalState(clientA, "visible");
// 		await fillOutItemForm(clientA, item);
// 		// Submit item form

// 		await clientA.click(cssSelectorWithText("button", "Create Item"));
// 		await waitForModalState(clientA, "hidden");

// 		// Check that the item is visible on the creator client
// 		await checkItemFieldVisibility(clientA, item);
// 		await waitForRefetch();

// 		// clientB can see new data
// 		await checkItemFieldVisibility(clientB, item);

// 		// ## Clicking item referenceLink link

// 		// We create a new browser context for when
// 		// the referenceLink links open in a new tab
// 		const [referenceLinkPageTab] = await Promise.all([
// 			context.waitForEvent("page"),
// 			clientB.click(`data-testid=item-row-${item.name} >> css=a`),
// 		]);
// 		expect(referenceLinkPageTab.url()).toEqual(item.referenceLink);
// 		await referenceLinkPageTab.close();

// 		// ## Editing An Item

// 		//Click on the items row to open the edit menu
// 		await clientB.click(`data-testid=item-row-${item.name}`);
// 		//Wait for the edit menu to open
// 		await waitForModalState(clientB, "visible");
// 		await fillOutItemForm(clientB, updatedItem);
// 		await clientB.click(cssSelectorWithText("button", "Save"));
// 		await waitForModalState(clientB, "hidden");

// 		await checkItemFieldVisibility(clientB, updatedItem);
// 		await waitForRefetch();
// 		// Other client can see updated item after refetch
// 		await checkItemFieldVisibility(clientA, updatedItem);
// 		// Check the original version of the item is not visible
// 		await checkItemFieldVisibility(clientA, item, false);
// 		await checkItemFieldVisibility(clientB, item, false);

// 		// ## Deleting An Item
// 		await openItemEditMenu(clientA, updatedItem);

// 		await clientA.click(cssSelectorWithText("button", "Delete"));
// 		await clientA.click(cssSelectorWithText("button", "Confirm"));

// 		await checkItemFieldVisibility(clientA, updatedItem, false);
// 		await waitForRefetch();
// 		await checkItemFieldVisibility(clientB, updatedItem, false);
// 	}
// );

test.describe("Simultaneous Updates", () => {
	testDualClientsWithNewSheet(
		"2 clients add members",
		async ({ clientA, clientB }) => {
			const bothClients = [clientA, clientB];
			const memberNames = ["client A member", "client B member"] as const;
			const [clientAMemberName, clientBMemberName] = memberNames;

			// Open options menu
			await performActionOnMultipleClients(bothClients, (client) =>
				client.click(sheetAddCharacterButton)
			);

			// Fill out member name fields
			await performActionOnMultipleClients(bothClients, (client, index) =>
				client.fill("[name='name']", memberNames[index])
			);
			// Click save button
			await performActionOnMultipleClients(bothClients, (client) =>
				client.click(characterDialogSaveButton)
			);

			const getClientMemberTags = () =>
				performActionOnMultipleClients(bothClients, (client) =>
					client.$$(sheetCharacterTag)
				);

			await wait(500);

			const [clientAMemberTags, clientBMemberTags] =
				await getClientMemberTags();

			// Before the refetch occurs, each sheet can only see 1 member
			expect(clientAMemberTags).toHaveLength(1);
			expect(await clientAMemberTags[0].innerText()).toBe(clientAMemberName);
			expect(clientBMemberTags).toHaveLength(1);
			expect(await clientBMemberTags[0].innerText()).toBe(clientBMemberName);

			await wait(SHEET_REFETCH_INTERVAL_MS + 2000);

			const refetchedClientTags = await getClientMemberTags();
			await performActionOnMultipleClients(
				bothClients,
				async (client, index) => {
					const memberTags = refetchedClientTags[index];
					const memberTagContents = await Promise.all(
						memberTags.map((tag) => tag.innerText())
					);

					expect(memberTags).toHaveLength(2);
					expect([...memberTagContents].sort()).toEqual(
						[...memberNames].sort()
					);
				}
			);
		}
	);

	testDualClientsWithNewSheet(
		"2 clients add items",
		async ({ clientA, clientB }) => {
			const bothClients = [clientA, clientB];
			const items = bothClients.map(() => generateRandomInventoryItem()) as [
				Item,
				Item
			];

			await performActionOnMultipleClients(bothClients, (client) =>
				client.click(sheetNewItemButton)
			);
			await performActionOnMultipleClients(
				bothClients,
				async (client, index) => {
					const { name } = items[index];

					await wait(100);
					await client.fill("#name", name);
					await client.click(sheetNewItemSaveButton);
					await wait(100);

					expect(await countItemRows(client)).toBe(1);
					expect(await getNameOfItemInTableAtRowIndex(client, 0)).toBe(name);
				}
			);

			await wait(SHEET_REFETCH_INTERVAL_MS + 2000);

			const sortedItems = A.sortBy(items, D.get("name"));
			await performActionOnMultipleClients(bothClients, async (client) => {
				expect(await countItemRows(client)).toBe(2);

				expect(await getNameOfItemInTableAtRowIndex(client, 0)).toBe(
					sortedItems[0].name
				);
				expect(await getNameOfItemInTableAtRowIndex(client, 1)).toBe(
					sortedItems[1].name
				);
			});
		}
	);
});
