import React from "react";
import { screen } from "@testing-library/dom";
import { act } from "@testing-library/react";
import { basicSheetFixture } from "../../fixtures/sheetFixtures";
import Sheet, { sheetPageTestIds } from "$root/pages/sheets/[sheetId]";
import { checkTestIdsRender, renderTest } from "../../utils/testUtils";
import {
	getItemTotalValue,
	getItemTotalWeight,
	createInventoryItem,
} from "$sheets/utils";
import getTestIdQuery from "../../utils/getTestIdQuery";
import {
	memberTotalsTableTestIds,
	inventoryTableTestIds,
} from "$sheets/components";

const basicSheetJsx = <Sheet {...basicSheetFixture} />;

const addMembersButtonText = "Add Members";
describe("Elements render", () => {
	const { items, name, members, _id } = basicSheetFixture;

	test("Static Elements", () => {
		act(() => {
			renderTest(<Sheet _id={_id} name={name} members={[]} items={[]} />);
		});

		checkTestIdsRender({ ...inventoryTableTestIds, ...sheetPageTestIds });
		//? Check rendering of all items with a test id

		["Reset Filters", addMembersButtonText, "Add New Item"].forEach(
			(textItem) => {
				expect(screen.getByText(textItem)).toBeInTheDocument();
			}
		);

		expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
		//? Searchbar
	});

	test("Basic Data", () => {
		act(() => {
			renderTest(<Sheet _id={_id} name={name} members={members} items={[]} />);
		});

		expect(screen.queryByText(addMembersButtonText)).toBeFalsy();
		//? 'Add Members' button should not be visible when the sheet has members

		expect(screen.getByText(name)).toBeInTheDocument;

		members.forEach((member) => {
			expect(screen.getAllByText(member.name)).toBeTruthy();
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
				<Sheet
					_id=""
					name=""
					items={[
						createInventoryItem({
							name: "",
							quantity: 1,
							weight: 1,
							value: 1,
						}),
					]}
					members={[]}
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
				<Sheet
					_id=""
					name=""
					items={[
						createInventoryItem({
							name: "",
							quantity: 2,
							weight: 4,
							value: 6,
						}),
					]}
					members={[]}
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
				<Sheet
					_id=""
					name=""
					items={[
						createInventoryItem({
							name: "",
							quantity: 2,
							weight: 0.1,
							value: 0.5,
						}),
					]}
					members={[]}
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
				<Sheet
					_id=""
					name=""
					items={[
						createInventoryItem({
							name: "",
							quantity: 3,
							weight: 0.15,
							value: 0.2,
						}),
					]}
					members={[]}
				/>
			);
		});

		const cells = getCells();
		expect(cells[1].textContent).toEqual(3 + "");
		expect(cells[2].textContent).toEqual(0.45 + "");
		expect(cells[3].textContent).toEqual(0.6 + "");
	});
});

describe("Sheet Member Carry Weights", () => {
	const testMemberId = "id";

	/**
	 * Fetch the weight/value cells of the first member in the "MemberTotalsTable"
	 *
	 * @returns An object containing the weight/value cell text contents
	 */
	const getCells = () => {
		const queryResult = document.querySelectorAll(
			`${getTestIdQuery(memberTotalsTableTestIds.root)} tbody tr td`
		);
		return {
			weight: queryResult[1].textContent,
			value: queryResult[2].textContent,
		};
	};

	test("Single Item (weight, value, quantity = 1)", () => {
		act(() => {
			renderTest(
				<Sheet
					_id=""
					name=""
					members={[
						{
							_id: testMemberId,
							carryCapacity: 1,
							name: "test name",
						},
					]}
					items={[
						createInventoryItem({
							name: "",
							weight: 1,
							value: 1,
							carriedBy: testMemberId,
						}),
					]}
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
				<Sheet
					_id=""
					name=""
					members={[
						{
							_id: testMemberId,
							carryCapacity: 1,
							name: "test name",
						},
					]}
					items={[
						createInventoryItem({
							name: "",
							weight: 0,
							value: 0,
							carriedBy: testMemberId,
						}),
					]}
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
				<Sheet
					_id=""
					name=""
					members={[
						{
							_id: testMemberId,
							carryCapacity: 1,
							name: "test name",
						},
					]}
					items={[
						createInventoryItem({
							name: "",
							weight: 0.15,
							value: 1.25,
							quantity: 3,
							carriedBy: testMemberId,
						}),
					]}
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
				<Sheet
					_id=""
					name=""
					members={[
						{
							_id: testMemberId,
							carryCapacity: 1,
							name: "test name",
						},
					]}
					items={[
						createInventoryItem({
							name: "",
							weight: 0.15,
							value: 1.25,
							quantity: 3,
							carriedBy: testMemberId,
						}),
						createInventoryItem({
							name: "",
							weight: 2.27,
							value: 0.31,
							quantity: 5,
							carriedBy: testMemberId,
						}),
						createInventoryItem({
							name: "",
							weight: 1.27,
							value: 0.68,
							quantity: 7,
							carriedBy: testMemberId,
						}),
					]}
				/>
			);
		});

		const { weight, value } = getCells();

		expect(weight).toEqual("20.69");
		expect(value).toEqual("10.06");
	});
});
