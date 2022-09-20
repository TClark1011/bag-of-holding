import React from "react";
import { screen } from "@testing-library/dom";
import { act } from "@testing-library/react";
import { basicSheetFixture } from "../../fixtures/sheetFixtures";
import SheetPage, { sheetPageTestIds } from "$root/pages/sheets/[sheetId]";
import { checkTestIdsRender, renderTest } from "../../utils/testUtils";
import {
	getItemTotalValue,
	getItemTotalWeight,
	createInventoryItem,
} from "$sheets/utils";
import getTestIdQuery from "../../utils/getTestIdQuery";
import {
	characterTotalsTableTestIds,
	inventoryTableTestIds,
} from "$sheets/components";

const basicSheetJsx = <SheetPage {...basicSheetFixture} />;

const addCharactersButtonText = "Add Members";
describe("Elements render", () => {
	const { items, name, characters, id } = basicSheetFixture;

	test("Static Elements", () => {
		act(() => {
			renderTest(
				<SheetPage
					id={id}
					name={name}
					characters={[]}
					items={[]}
					updatedAt={new Date()}
				/>
			);
		});

		checkTestIdsRender({ ...inventoryTableTestIds, ...sheetPageTestIds });
		//? Check rendering of all items with a test id

		["Reset Filters", addCharactersButtonText, "Add New Item"].forEach(
			(textItem) => {
				expect(screen.getByText(textItem)).toBeInTheDocument();
			}
		);

		expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
		//? Searchbar
	});

	test("Basic Data", () => {
		act(() => {
			renderTest(
				<SheetPage
					id={id}
					name={name}
					characters={characters}
					items={[]}
					updatedAt={new Date()}
				/>
			);
		});

		expect(screen.queryByText(addCharactersButtonText)).toBeFalsy();
		//? 'Add Characters' button should not be visible when the sheet has characters

		expect(screen.getByText(name)).toBeInTheDocument;

		characters.forEach((character) => {
			expect(screen.getAllByText(character.name)).toBeTruthy();
		});
	});

	test("Items", () => {
		act(() => {
			renderTest(basicSheetJsx);
		});
		items.forEach((item) => {
			expect(screen.getByText(item.name)).toBeInTheDocument();
			expect(screen.getAllByText(getItemTotalValue(item))).toBeTruthy();
			expect(screen.getAllByText(getItemTotalWeight(item))).toBeTruthy();
			expect(screen.getAllByText(item.quantity + "")).toBeTruthy();
		});
	});
});

describe("Computed values are correct", () => {
	/**
	 * Fetch the table cells that contain item data
	 *
	 * @returns The cell elements
	 */
	const getCells = () =>
		document.querySelectorAll(
			`${getTestIdQuery(inventoryTableTestIds.tableRoot)} tbody tr td`
		);

	test("All 1s", () => {
		act(() => {
			renderTest(
				<SheetPage
					id=""
					name=""
					items={[
						createInventoryItem({
							name: "",
							quantity: 1,
							weight: 1,
							value: 1,
							carriedByCharacterId: null,
							category: null,
							description: null,
							referenceLink: null,
							sheetId: null,
						}),
					]}
					characters={[]}
					updatedAt={new Date()}
				/>
			);
		});

		const cells = getCells();
		expect(cells[1].textContent).toEqual(1 + "");
		expect(cells[2].textContent).toEqual(1 + "");
		expect(cells[3].textContent).toEqual(1 + "");
	});
	test("Basic Integers", () => {
		act(() => {
			renderTest(
				<SheetPage
					id=""
					name=""
					items={[
						createInventoryItem({
							name: "",
							quantity: 2,
							weight: 4,
							value: 6,
							carriedByCharacterId: null,
							category: null,
							description: null,
							referenceLink: null,
							sheetId: null,
						}),
					]}
					characters={[]}
					updatedAt={new Date()}
				/>
			);
		});

		const cells = getCells();
		expect(cells[1].textContent).toEqual(2 + "");
		expect(cells[2].textContent).toEqual(8 + "");
		expect(cells[3].textContent).toEqual(12 + "");
	});
	test("Basic Floats", () => {
		act(() => {
			renderTest(
				<SheetPage
					id=""
					name=""
					items={[
						createInventoryItem({
							name: "",
							quantity: 2,
							weight: 0.1,
							value: 0.5,
							carriedByCharacterId: null,
							category: null,
							description: null,
							referenceLink: null,
							sheetId: null,
						}),
					]}
					characters={[]}
					updatedAt={new Date()}
				/>
			);
		});

		const cells = getCells();
		expect(cells[1].textContent).toEqual(2 + "");
		expect(cells[2].textContent).toEqual(0.2 + "");
		expect(cells[3].textContent).toEqual(1 + "");
	});

	test("Problematic floats", () => {
		act(() => {
			renderTest(
				<SheetPage
					id=""
					name=""
					items={[
						createInventoryItem({
							name: "",
							quantity: 3,
							weight: 0.15,
							value: 0.2,
							carriedByCharacterId: null,
							category: null,
							description: null,
							referenceLink: null,
							sheetId: null,
						}),
					]}
					characters={[]}
					updatedAt={new Date()}
				/>
			);
		});

		const cells = getCells();
		expect(cells[1].textContent).toEqual(3 + "");
		expect(cells[2].textContent).toEqual(0.45 + "");
		expect(cells[3].textContent).toEqual(0.6 + "");
	});
});

describe("Sheet Character Carry Weights", () => {
	const testCharacterId = "id";

	/**
	 * Fetch the weight/value cells of the first character in the "CharacterTotalsTable"
	 *
	 * @returns An object containing the weight/value cell text contents
	 */
	const getCells = () => {
		const queryResult = document.querySelectorAll(
			`${getTestIdQuery(characterTotalsTableTestIds.root)} tbody tr td`
		);
		return {
			weight: queryResult[1].textContent,
			value: queryResult[2].textContent,
		};
	};

	test("Single Item (weight, value, quantity = 1)", () => {
		act(() => {
			renderTest(
				<SheetPage
					id=""
					name=""
					characters={[
						{
							id: testCharacterId,
							carryCapacity: 1,
							name: "test name",
							sheetId: "",
						},
					]}
					items={[
						createInventoryItem({
							name: "",
							weight: 1,
							value: 1,
							carriedByCharacterId: testCharacterId,
							category: null,
							description: null,
							referenceLink: null,
							sheetId: null,
						}),
					]}
					updatedAt={new Date()}
				/>
			);
		});

		const { weight, value } = getCells();

		expect(weight).toEqual("1");
		expect(value).toEqual("1");
	});
	test("Single Item (weight, value = 0,  quantity = 1)", () => {
		act(() => {
			renderTest(
				<SheetPage
					id=""
					name=""
					characters={[
						{
							id: testCharacterId,
							carryCapacity: 1,
							name: "test name",
							sheetId: "",
						},
					]}
					items={[
						createInventoryItem({
							name: "",
							weight: 0,
							value: 0,
							carriedByCharacterId: testCharacterId,
							category: null,
							description: null,
							referenceLink: null,
							sheetId: null,
						}),
					]}
					updatedAt={new Date()}
				/>
			);
		});

		const { weight, value } = getCells();

		expect(weight).toEqual("0");
		expect(value).toEqual("0");
	});
	test("Single Item (weight = 0.15, value = 1.25,  quantity = 3)", () => {
		act(() => {
			renderTest(
				<SheetPage
					id=""
					name=""
					characters={[
						{
							id: testCharacterId,
							carryCapacity: 1,
							name: "test name",
							sheetId: "",
						},
					]}
					items={[
						createInventoryItem({
							name: "",
							weight: 0.15,
							value: 1.25,
							quantity: 3,
							carriedByCharacterId: testCharacterId,
							category: null,
							description: null,
							referenceLink: null,
							sheetId: null,
						}),
					]}
					updatedAt={new Date()}
				/>
			);
		});

		const { weight, value } = getCells();

		expect(weight).toEqual("0.45");
		expect(value).toEqual("3.75");
	});
	test("3 Items (All problematic floats with multiple quantities)", () => {
		act(() => {
			renderTest(
				<SheetPage
					id=""
					name=""
					characters={[
						{
							id: testCharacterId,
							carryCapacity: 1,
							name: "test name",
							sheetId: "",
						},
					]}
					items={[
						createInventoryItem({
							name: "",
							weight: 0.15,
							value: 1.25,
							quantity: 3,
							carriedByCharacterId: testCharacterId,
							category: null,
							description: null,
							referenceLink: null,
							sheetId: null,
						}),
						createInventoryItem({
							name: "",
							weight: 2.27,
							value: 0.31,
							quantity: 5,
							carriedByCharacterId: testCharacterId,
							category: null,
							description: null,
							referenceLink: null,
							sheetId: null,
						}),
						createInventoryItem({
							name: "",
							weight: 1.27,
							value: 0.68,
							quantity: 7,
							carriedByCharacterId: testCharacterId,
							category: null,
							description: null,
							referenceLink: null,
							sheetId: null,
						}),
					]}
					updatedAt={new Date()}
				/>
			);
		});

		const { weight, value } = getCells();

		expect(weight).toEqual("20.69");
		expect(value).toEqual("10.06");
	});
});
