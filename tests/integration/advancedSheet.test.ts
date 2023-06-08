import { testDualClientsWithNewSheet } from "$tests/fixtures/playwrightFixtures";
import {
	performActionOnMultipleClients,
	screenshot,
} from "$tests/utils/sheetAutomations";
import { Page } from "@playwright/test";
import Big from "big.js";
import { random } from "faker";

type ItemFields = {
	name: string;
	value?: string;
	weight?: string;
	quantity?: string;
	category?: string;
	carriedBy?: string;
	description?: string;
	referenceLink?: string;
};

const fillOutItemForm = async (client: Page, fields: Partial<ItemFields>) => {
	if (fields.name) await client.locator("#name").fill(fields.name);
	if (fields.description)
		await client.locator("#description").fill(fields.description);
	if (fields.quantity) await client.locator("#quantity").fill(fields.quantity);
	if (fields.weight) await client.locator("#weight").fill(fields.weight);
	if (fields.value) await client.locator("#value").fill(fields.value);
	if (fields.referenceLink)
		await client.locator("#referenceLink").fill(fields.referenceLink);
	if (fields.category !== undefined)
		await client.locator("#category").fill(fields.category);
	if (fields.carriedBy !== undefined)
		await client
			.locator("#carriedByCharacterId")
			.selectOption({ label: fields.carriedBy });
};

const checkItemVisibility = async (
	client: Page,
	fields: ItemFields,
	shouldBeVisible: boolean
) => {
	const expectedState = shouldBeVisible ? "visible" : "hidden";

	const quantityBig = new Big(fields.quantity ?? "1");

	const nameCellSelector = `td[data-column="name"]:text-is("${fields.name}")`;

	const row = await client.locator("tr", {
		has: client.locator(nameCellSelector),
	});

	await row.waitFor({ state: expectedState });

	await row
		.locator(
			`td[data-column="value"]:text-is("${quantityBig
				.times(fields.value ?? "0")
				.toString()}")`
		)
		.waitFor({ state: expectedState });

	await row
		.locator(
			`td[data-column="weight"]:text-is("${quantityBig
				.times(fields.weight ?? "0")
				.toString()}")`
		)
		.waitFor({ state: expectedState });
	if (fields.category !== undefined)
		await row
			.locator(`td[data-column="category"]:text-is("${fields.category}")`)
			.waitFor({ state: expectedState });

	if (fields.carriedBy !== undefined)
		await row
			.locator(
				`td[data-column="carriedByCharacterId"]:has-text("${fields.carriedBy}")`
			)
			.waitFor({ state: expectedState });
};

const firstCharacterName = `${random.word()} (1)`;
const secondCharacterName = `${random.word()} (2)`;
const thirdCharacterName = `${random.word()} (3)`;
const fourthCharacterName = `${random.word()} (4)`;

const firstItem: ItemFields = {
	name: `A${random.word()}(i1)`,
	value: "0.25",
	weight: "0.7",
	category: "cat 1",
	quantity: "1",
};

const secondItem: ItemFields = {
	name: `B${random.word()}(i2)`,
	value: "0",
	weight: "0.5",
	quantity: "3",
	category: "cat 2",
};

const thirdItem: ItemFields = {
	name: `C${random.word()}(i3)`,
	value: "4",
	quantity: "6",
	weight: "0",
	carriedBy: firstCharacterName,
};

const fourthItem: ItemFields = {
	name: `D${random.word()}(i4)`,
	value: "12.78",
	quantity: "8",
	weight: "0.01",
	carriedBy: secondCharacterName,
};

const fifthItem: ItemFields = {
	name: `E${random.word()}(i5)`,
	value: "0",
	quantity: "1",
	weight: "0",
	carriedBy: fourthCharacterName,
};

const editedSheetName = random.word();

testDualClientsWithNewSheet.setTimeout(1000 * 100);

testDualClientsWithNewSheet(
	"Advanced Sheet Test",
	async ({ clientA, clientB }) => {
		const newSheetName = "Test Sheet";

		/* #region  Change Sheet Name */
		await clientA.click("h2 + button");
		await clientA.locator('input[name="name"]').fill(newSheetName);
		await clientA.locator("text=Save").click();

		await performActionOnMultipleClients([clientA, clientB], (client) =>
			client.waitForSelector(`h2:has-text("${newSheetName}")`)
		);
		/* #endregion */

		/* #region  First Item */
		await clientA.locator('[data-testid="add-item-button"]').click();
		await fillOutItemForm(clientA, firstItem);
		await clientA.locator("button:text('Create')").click();
		await performActionOnMultipleClients([clientA, clientB], (client) =>
			checkItemVisibility(client, firstItem, true)
		);
		/* #endregion */

		/* #region  Second Item */
		await clientB.locator('[data-testid="add-item-button"]').click();
		await fillOutItemForm(clientB, secondItem);
		await clientB.locator("button:text('Create')").click();
		await performActionOnMultipleClients([clientA, clientB], (client) =>
			checkItemVisibility(client, firstItem, true)
		);
		/* #endregion */

		/* #region  Create First Character */
		await clientA.locator("text=Add Character").click();
		await clientA.locator("#name").fill(firstCharacterName);
		await clientA.locator("text=Save").click();
		await performActionOnMultipleClients([clientA, clientB], (client) =>
			client.waitForSelector(`button:text-is("${firstCharacterName}")`)
		);
		/* #endregion */

		/* #region  Third item (give to first character) */
		await clientA.locator('[data-testid="add-item-button"]').click();
		await fillOutItemForm(clientA, thirdItem);
		await clientA.locator("button:text('Create')").click();
		await performActionOnMultipleClients([clientA], (client) =>
			checkItemVisibility(client, thirdItem, true)
		);
		/* #endregion */

		/* #region  Second Character */
		await clientB.locator("text=Add Character").click();
		await clientB.locator("#name").fill(secondCharacterName);
		await clientB.locator("text=Save").click();
		await performActionOnMultipleClients([clientA, clientB], (client) =>
			client.waitForSelector(`button:text-is("${secondCharacterName}")`)
		);
		/* #endregion */

		/* #region Give first item to first character */
		firstItem.carriedBy = firstCharacterName;
		await clientA.locator(`tr:has-text("${firstItem.name}")`).click();
		await fillOutItemForm(clientA, firstItem);
		await clientA.locator("text=Save").click();
		await performActionOnMultipleClients([clientA, clientB], (client) =>
			checkItemVisibility(client, firstItem, true)
		);

		/* #endregion */

		/* #region  Filtering */

		// Open CarriedBy Filter Menu
		await clientB
			.locator(
				'[data-testid="InventoryTable__CarriedByColumnHeader"] [aria-label="filter"]'
			)
			.click();
		// Uncheck All
		await clientB
			.locator(
				'[data-testid="InventoryTable__CarriedByColumnHeader"] >> text=Uncheck All'
			)
			.click();

		await checkItemVisibility(clientB, firstItem, false);
		await checkItemVisibility(clientB, secondItem, false);
		await checkItemVisibility(clientB, thirdItem, false);

		// Check All
		await clientB.locator("text=Check All").nth(1).click();
		await checkItemVisibility(clientB, firstItem, true);
		await checkItemVisibility(clientB, secondItem, true);
		await checkItemVisibility(clientB, thirdItem, true);

		// Uncheck all
		await clientB
			.locator(
				'[data-testid="InventoryTable__CarriedByColumnHeader"] >> text=Uncheck All'
			)
			.click();

		// Check only first character
		await clientB
			.locator(
				`li:has-text("${firstCharacterName}") .chakra-checkbox .chakra-checkbox__control`
			)
			.click();

		await checkItemVisibility(clientB, firstItem, true);
		await checkItemVisibility(clientB, secondItem, false);
		await checkItemVisibility(clientB, thirdItem, true);

		// Close Filter Menu
		await clientB.locator("body").press("Escape");

		// Reset Filters
		await clientB.locator("button >> text=Reset Filters").click();

		await screenshot(clientB, "reset filters");

		await checkItemVisibility(clientB, firstItem, true);
		await checkItemVisibility(clientB, secondItem, true);
		await checkItemVisibility(clientB, thirdItem, true);

		// Open Category Filter
		await clientB
			.locator(
				'[data-testid="InventoryTable__CategoryColumnHeader"] [aria-label="filter"]'
			)
			.click();

		// Uncheck second item category
		await clientB
			.locator(
				`li:has-text("${firstItem.category}") .chakra-checkbox .chakra-checkbox__control`
			)
			.click();

		await clientB.locator("body").press("Escape");
		await screenshot(clientB, "after-unchecking-category");

		await checkItemVisibility(clientB, firstItem, false);
		await checkItemVisibility(clientB, secondItem, true);
		await checkItemVisibility(clientB, thirdItem, true);

		// Reset Filters
		await clientB.locator("button >> text=Reset Filters").click();

		await screenshot(clientB, "reset filters");

		await checkItemVisibility(clientB, firstItem, true);
		await checkItemVisibility(clientB, secondItem, true);
		await checkItemVisibility(clientB, thirdItem, true);
		/* #endregion */

		// TODO: Sorting
		await clientA.locator("tr:first-child td", {
			hasText: firstItem.name,
		}); // By default (alpha sorting) first item should be first
		await clientA
			.locator("thead button", {
				hasText: "Weight",
			})
			.click(); // Sort by weight
		await clientA.locator("tr:first-child td", {
			hasText: secondItem.name,
		}); //Second item should now be first
		await clientA.locator("tr:last-child td", {
			hasText: fifthItem.name,
		}); //fifth item should be last

		return;

		/* #region  Create Fourth Item (Give to second character) */
		await clientA.locator('[data-testid="add-item-button"]').click();
		await fillOutItemForm(clientA, fourthItem);
		await clientA.locator("button:text('Create')").click();

		await performActionOnMultipleClients([clientA, clientB], (client) =>
			checkItemVisibility(client, fourthItem, true)
		);
		/* #endregion */

		/* #region  Delete First Character(Items to second character) */
		firstItem.carriedBy = secondCharacterName;
		thirdItem.carriedBy = secondCharacterName;

		await clientA.locator(`button:has-text("${firstCharacterName}")`).click();
		await clientA.locator("text=Delete").click();
		await clientA.locator('label:has([value="item-pass"])').click();
		await clientA.locator('select[name="passToTarget"]').selectOption({
			label: secondCharacterName,
		});
		await clientA.locator("text=Confirm").click();

		await performActionOnMultipleClients([clientA, clientB], async (client) => {
			await checkItemVisibility(client, firstItem, true);
			await checkItemVisibility(client, secondItem, true);
			await checkItemVisibility(client, thirdItem, true);
			await checkItemVisibility(client, fourthItem, true);
			await client.waitForSelector(`button >> text=${firstCharacterName}`, {
				state: "hidden",
			});
		});
		/* #endregion */

		/* #region  Create Third Character */
		await clientB.locator("text=Add Character").click();
		await clientB.locator('input[name="name"]').click();
		await clientB.locator('input[name="name"]').fill(thirdCharacterName);
		await clientB.locator("text=Save").click();

		await performActionOnMultipleClients([clientA, clientB], (client) =>
			client.waitForSelector(`button >> text=${thirdCharacterName}`)
		);
		/* #endregion */

		/* #region  Delete Second Character */
		await clientA.locator(`button >> text=${secondCharacterName}`).click();
		await clientA.locator("text=Delete").click();
		await clientA.locator("text=Delete From Sheet").click();
		await clientA.locator("text=Confirm").click();
		await performActionOnMultipleClients([clientA, clientB], (client) =>
			client.waitForSelector(`button >> text=${secondCharacterName}`, {
				state: "hidden",
			})
		);
		/* #endregion */

		/* #region  Give Second Item to third character */
		await clientA.locator(`tr:has-text("${secondItem.name}")`).click();
		await clientA
			.locator('select[name="carriedByCharacterId"]')
			.selectOption({ label: thirdCharacterName });
		await clientA.locator("text=Save").click();

		secondItem.carriedBy = thirdCharacterName;
		await performActionOnMultipleClients([clientA, clientB], (client) =>
			checkItemVisibility(client, secondItem, true)
		);
		/* #endregion */

		/* #region  Delete Third Character(items = carried by nobody) */
		await clientA.locator(`button >> text=${thirdCharacterName}`).click();
		await clientA.locator("text=Delete").click();
		await clientA.locator('text=/.*Set "Carried To" to "Nobody".*/').click();
		await clientA.locator("text=Confirm").click();

		secondItem.carriedBy = "";
		await performActionOnMultipleClients([clientA, clientB], (client) =>
			checkItemVisibility(client, secondItem, true)
		);
		/* #endregion */

		/* #region  Change Sheet Name */
		await clientA.locator('[aria-label="edit sheet name"]').click();
		await clientA.locator('input[name="name"]').fill(editedSheetName);
		await clientA.locator("text=Save").click();
		await performActionOnMultipleClients([clientA, clientB], async (client) =>
			client
				.locator("h2", { hasText: editedSheetName })
				.waitFor({ state: "visible" })
		);
		/* #endregion */

		/* #region  Create Fourth Character */
		await clientA.locator("text=Add Character").click();
		await clientA.locator('input[name="name"]').fill(fourthCharacterName);
		await clientA.locator("text=Save").click();

		await performActionOnMultipleClients([clientA, clientB], (client) =>
			client.waitForSelector(`button >> text=${fourthCharacterName}`)
		);
		/* #endregion */

		/* #region  Create Fifth Item, give to fourth character */
		await clientB.locator("text=Add New Item").click();
		await fillOutItemForm(clientB, fifthItem);
		await clientB.locator("button:text('Create')").click();
		await performActionOnMultipleClients([clientA, clientB], (client) =>
			checkItemVisibility(client, fifthItem, true)
		);
		/* #endregion */

		/* #region  Delete Fourth Character (Delete Items) */
		await clientA.locator(`button:has-text("${fourthCharacterName}")`).click();
		await clientA.locator("text=Delete").click();
		await clientA.locator("text=Delete From Sheet").click();
		await clientA.locator("text=Confirm").click();
		await performActionOnMultipleClients([clientA, clientB], async (client) => {
			await client.waitForSelector(`button >> text=${fourthCharacterName}`, {
				state: "hidden",
			});
			await checkItemVisibility(client, fifthItem, false);
		});
		/* #endregion */
	}
);
