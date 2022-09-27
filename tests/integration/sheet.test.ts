import { appGitLink } from "$root/constants";
import { NonEmptyArray } from "$root/types";
import { takeRandom } from "$root/utils";
import { Item, Character } from "@prisma/client";
import { getItemTotalValue, searchComparison } from "$sheets/utils";
import {
	testWithNewSheet,
	testWithExistingSheet,
} from "$tests/fixtures/playwrightFixtures";
import getMostCommonLetterCombo from "$tests/utils/getMostCommonLetterCombo";
import { generateRandomInventoryItem } from "$tests/utils/randomGenerators";
import {
	checkItemFieldVisibility,
	countItemRows,
	fillOutItemForm,
	fillSearchBar,
	getNameOfItemInTableAtRowIndex,
	getSheetTitle,
	openItemEditMenu,
	performActionOnMultipleClients,
	waitForModalState,
} from "$tests/utils/sheetAutomations";
import {
	columnFilterButton,
	cssSelectorWithText,
	openPopover,
	selectWithinColumnHeader,
	selectWithinTable,
	sheetMemberTag,
	sheetNewItemButton,
	sheetNewItemSaveButton,
	sheetOptionsAddMemberButton,
	sheetOptionsButton,
	sheetOptionsSaveButton,
} from "$tests/utils/usefulSelectors";
import wait from "$tests/utils/wait";
import { A, D, F, flow, pipe, S } from "@mobily/ts-belt";
import test, { expect } from "@playwright/test";
import * as faker from "faker";

/**
 * Generate a test name to use for an
 * entity. Takes a passed string,
 * prefixes it with '__Test' and then
 * appends it with a 5 character long
 * random alpha-numeric string.
 *
 * @param entityType The type of entity
 * to name.
 * @returns a name for the entity.
 */
const testNameGenerator = (entityType: string) =>
	`_T.${entityType}.${faker.random.alphaNumeric(2)}`;

const [sheetName, updatedSheetName] = A.makeWithIndex(2, () =>
	testNameGenerator("Sheet")
);
const [memberName, updatedMemberName, secondMemberName] = A.makeWithIndex(
	3,
	() => testNameGenerator("Member")
);

test("Create New Sheet, Close Welcome", async ({ page, baseURL }) => {
	await page.goto("/");
	await page.click("#new-sheet-button");

	expect(page.url()).toBe(`${baseURL}/new`);

	await page.waitForNavigation({
		url: "**/sheets/*",
	});

	await waitForModalState(page, "visible", "Welcome!");
	await page.click(cssSelectorWithText("button", "Close"));
	await page.waitForSelector("text=Sheet Options");
	await page.keyboard.press("Escape");
	await waitForModalState(page, "hidden", "Welcome!");

	expect(await getSheetTitle(page)).toBe("New Sheet");
});

testWithNewSheet(
	"Edit Sheet Options",
	async ({ page, clientB, waitForRefetch }) => {
		await page.click(sheetOptionsButton);
		await waitForModalState(page, "visible");

		await page.fill("#name", sheetName);
		await page.click(sheetOptionsAddMemberButton);
		await page.fill("[name='characters.0.name']", memberName);
		await page.click(sheetOptionsSaveButton);

		await page.locator("text=Sheet Options").waitFor({
			state: "hidden",
		});

		expect(await getSheetTitle(page)).toBe(sheetName);
		expect(await page.isVisible(`text=${memberName}`)).toBe(true);

		await waitForRefetch();

		expect(await getSheetTitle(page)).toBe(sheetName);
		expect(await clientB.isVisible(`text=${memberName}`)).toBe(true);
	}
);

testWithExistingSheet("Advanced Operations", async ({ page, sheet }) => {
	// ### general helpers
	const clickColumnSortButton = (header: string) =>
		page.click(
			selectWithinColumnHeader(header, `button:has-text("${header}")`)
		);
	const getNameOfItemInTable = async (index: number) =>
		pipe(
			await page.innerText(
				selectWithinTable(
					// `tbody >> tr >> nth=${index} >> td[data-column=\"name\"]`
					`tbody >> tr:has(td[data-column=\"name\"]) >> nth=${index} >> td[data-column=\"name\"]`
				)
			),
			S.trim
		);

	const sortedItemNames = pipe(
		sheet.items,
		A.sortBy(D.getUnsafe("name")),
		A.map(D.getUnsafe("name"))
	);

	// ### sort by name
	// Check default is sorting by name
	expect(await getNameOfItemInTable(0)).toBe(A.head(sortedItemNames));
	await clickColumnSortButton("Name");
	// Sorting should be reversed after clicking on the name column header
	expect(await getNameOfItemInTable(0)).toBe(A.last(sortedItemNames));

	// ### filter helpers
	const itemCategories = pipe(
		sheet.items,
		A.map(D.get("category")),
		A.uniq
	) as NonEmptyArray<string>;
	const memberToFilterOut = takeRandom(
		sheet.characters as NonEmptyArray<Character>
	);
	const isCarriedByFilteredOutMember = flow(
		(val: Item) => val,
		D.getUnsafe("carriedByCharacterId"),
		F.equals(memberToFilterOut.id)
	);
	const getNumberOfItemRowsCarriedByMember = async ({ name }: Character) => {
		const rows = await page.$$(
			selectWithinTable(
				`tbody >> tr >> td[data-column="carriedByCharacterId"]:has-text("${name}")`
			)
		);
		return rows.length;
	};

	// ### filter out a single member

	// First we check that the sheet is currently showing items
	// carried by the member which we will filter out
	expect(
		await getNumberOfItemRowsCarriedByMember(memberToFilterOut)
	).toBeGreaterThan(0);

	// Click on "Carried By" column filter button
	await page.click(selectWithinColumnHeader("Carried By", columnFilterButton));
	await page.waitForSelector(openPopover);
	await page.click(`${openPopover} >> text="${memberToFilterOut.name}"`);
	// Press escape to close popover
	await page.keyboard.press("Escape");
	// Wait for popover to be hidden
	await page.locator(openPopover).waitFor({
		state: "hidden",
	});

	const filteredAndSortedItems = pipe(
		sheet.items,
		A.reject(isCarriedByFilteredOutMember),
		A.sortBy(D.get("name"))
	);
	expect(await countItemRows(page)).toBe(filteredAndSortedItems.length);
	expect(await getNameOfItemInTable(0)).toBe(
		A.last(filteredAndSortedItems).name
	);
	expect(await getNameOfItemInTable(-1)).toBe(
		A.head(filteredAndSortedItems).name
	);

	expect(await getNumberOfItemRowsCarriedByMember(memberToFilterOut)).toBe(0);

	// ### sort by a numeric field
	const itemsSortedByValue = pipe(
		filteredAndSortedItems,
		A.sortBy(getItemTotalValue)
	);
	await clickColumnSortButton("Value");

	expect(await getNameOfItemInTable(0)).toBe(A.head(itemsSortedByValue).name);
	expect(await getNameOfItemInTable(-1)).toBe(A.last(itemsSortedByValue).name);

	await clickColumnSortButton("Value");

	expect(await getNameOfItemInTable(0)).toBe(A.last(itemsSortedByValue).name);
	expect(await getNameOfItemInTable(-1)).toBe(A.head(itemsSortedByValue).name);

	// ### filter out a category
	// open the "Carried By" filter menu
	await page.click(selectWithinColumnHeader("Carried By", columnFilterButton));

	// ### Filter out all members
	const categoryToFilterOut = takeRandom(itemCategories);
	const itemIsCarriedByFilteredOutMember = (item: Item) =>
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
		itemIsCarriedByFilteredOutMember
	);

	expect(await countItemRows(page)).toBe(itemsWithCategoryFilter.length);

	// ### Search
	const itemNames = itemsWithCategoryFilter.map(
		D.get("name")
	) as NonEmptyArray<string>;
	// We will search for the most common 2 letter combo
	// across all the item names
	const searchQuery = getMostCommonLetterCombo(itemNames, 2);
	const itemNamesThatContainSearchQuery = itemNames.filter((val) =>
		searchComparison(val, searchQuery)
	);

	// Type search query
	await fillSearchBar(page, searchQuery);
	expect(await countItemRows(page)).toBe(
		itemNamesThatContainSearchQuery.length
	);

	// Reset the search
	await fillSearchBar(page, "");
	expect(await countItemRows(page)).toBe(itemsWithCategoryFilter.length);

	// ### Reset all filters
	await page.click("text=Reset Filters");
	expect(await countItemRows(page)).toBe(sheet.items.length);
});

testWithNewSheet(
	"Advanced 2 client interactions",
	async ({ clientA, clientB, context, waitForRefetch }) => {
		// # SHEET OPTIONS

		// ## Edit Basic Sheet Options
		await clientB.click(sheetOptionsButton);

		// Wait for modal to appear
		await waitForModalState(clientB, "visible");

		await clientB.fill("#name", updatedSheetName);
		await clientB.click(sheetOptionsAddMemberButton);
		await clientB.click(sheetOptionsAddMemberButton);
		await clientB.fill("[name='characters.0.name']", updatedMemberName);
		await clientB.fill("[name='characters.1.name']", secondMemberName);
		await clientB.click("text=Save");

		await waitForModalState(clientB, "hidden");

		// check sheet title matches
		expect(await getSheetTitle(clientB)).toBe(updatedSheetName);
		// first members name
		expect(
			await clientB.isVisible(
				`[data-testid="member-tag"]:has-text("${updatedMemberName}")`
			)
		).toBeTruthy();
		// second members name
		expect(
			await clientB.isVisible(
				`[data-testid="member-tag"]:has-text("${secondMemberName}")`
			)
		).toBeTruthy();

		await waitForRefetch();

		expect(await getSheetTitle(clientA)).toBe(updatedSheetName);
		expect(
			await clientA.isVisible(
				`[data-testid="member-tag"]:has-text("${updatedMemberName}")`
			)
		).toBeTruthy();

		expect(
			await clientA.isVisible(
				`[data-testid="member-tag"]:has-text("${secondMemberName}")`
			)
		).toBeTruthy();

		// # INVENTORY ITEMS
		const item = generateRandomInventoryItem({
			referenceLink: appGitLink,
			carriedByCharacterId: updatedMemberName,
		});
		const updatedItem = generateRandomInventoryItem({
			carriedByCharacterId: secondMemberName,
		});

		// ## Creating An Item
		await clientA.click("data-testid=add-item-button");
		// waiting for new item modal to open
		await waitForModalState(clientA, "visible");
		await fillOutItemForm(clientA, item);
		// Submit item form

		await clientA.click(cssSelectorWithText("button", "Create Item"));
		await waitForModalState(clientA, "hidden");

		// Check that the item is visible on the creator client
		await checkItemFieldVisibility(clientA, item);
		await waitForRefetch();

		// clientB can see new data
		await checkItemFieldVisibility(clientB, item);

		// ## Clicking item referenceLink link

		// We create a new browser context for when
		// the referenceLink links open in a new tab
		const [referenceLinkPageTab] = await Promise.all([
			context.waitForEvent("page"),
			clientB.click(`data-testid=item-row-${item.name} >> css=a`),
		]);
		expect(referenceLinkPageTab.url()).toEqual(item.referenceLink);
		await referenceLinkPageTab.close();

		// ## Editing An Item

		//Click on the items row to open the edit menu
		await clientB.click(`data-testid=item-row-${item.name}`);
		//Wait for the edit menu to open
		await waitForModalState(clientB, "visible");
		await fillOutItemForm(clientB, updatedItem);
		await clientB.click(cssSelectorWithText("button", "Save"));
		await waitForModalState(clientB, "hidden");

		await checkItemFieldVisibility(clientB, updatedItem);
		await waitForRefetch();
		// Other client can see updated item after refetch
		await checkItemFieldVisibility(clientA, updatedItem);
		// Check the original version of the item is not visible
		await checkItemFieldVisibility(clientA, item, false);
		await checkItemFieldVisibility(clientB, item, false);

		// ## Deleting An Item
		await openItemEditMenu(clientA, updatedItem);

		await clientA.click(cssSelectorWithText("button", "Delete"));
		await clientA.click(cssSelectorWithText("button", "Confirm"));

		await checkItemFieldVisibility(clientA, updatedItem, false);
		await waitForRefetch();
		await checkItemFieldVisibility(clientB, updatedItem, false);
	}
);

test.describe("Simultaneous Updates", () => {
	testWithNewSheet("2 clients add members", async ({ clientA, clientB }) => {
		const bothClients = [clientA, clientB];
		const memberNames = ["client A member", "client B member"] as const;
		const [clientAMemberName, clientBMemberName] = memberNames;

		// Open options menu
		await performActionOnMultipleClients(bothClients, (client) =>
			client.click(sheetOptionsButton)
		);
		// Click add member button
		await performActionOnMultipleClients(bothClients, (client) =>
			client.click(sheetOptionsAddMemberButton)
		);
		// Fill out member name fields
		await performActionOnMultipleClients(bothClients, (client, index) =>
			client.fill("[name='characters.0.name']", memberNames[index])
		);
		// Click save button
		await performActionOnMultipleClients(bothClients, (client) =>
			client.click(sheetOptionsSaveButton)
		);

		const getClientMemberTags = () =>
			performActionOnMultipleClients(bothClients, (client) =>
				client.$$(sheetMemberTag)
			);

		const [clientAMemberTags, clientBMemberTags] = await getClientMemberTags();

		// Before the refetch occurs, each sheet can only see 1 member
		expect(clientAMemberTags).toHaveLength(1);
		expect(await clientAMemberTags[0].innerText()).toBe(clientAMemberName);
		expect(clientBMemberTags).toHaveLength(1);
		expect(await clientBMemberTags[0].innerText()).toBe(clientBMemberName);

		wait(7000);

		const refetchedClientTags = await getClientMemberTags();
		await performActionOnMultipleClients(bothClients, async (client, index) => {
			const memberTags = refetchedClientTags[index];
			const memberTagContents = await Promise.all(
				memberTags.map((tag) => tag.innerText())
			);

			expect(memberTags).toHaveLength(2);
			expect([...memberTagContents].sort()).toEqual([...memberNames].sort());
		});
	});

	testWithNewSheet("2 clients add items", async ({ clientA, clientB }) => {
		const bothClients = [clientA, clientB];
		const items = bothClients.map(() => generateRandomInventoryItem()) as [
			Item,
			Item
		];

		await performActionOnMultipleClients(bothClients, (client) =>
			client.click(sheetNewItemButton)
		);
		await performActionOnMultipleClients(bothClients, async (client, index) => {
			const { name } = items[index];

			await waitForModalState(client, "visible");
			await client.fill("#name", name);
			await client.click(sheetNewItemSaveButton);
			await waitForModalState(client, "hidden");

			expect(await countItemRows(client)).toBe(1);
			expect(await getNameOfItemInTableAtRowIndex(client, 0)).toBe(name);
		});

		wait(10000);

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
	});
});
