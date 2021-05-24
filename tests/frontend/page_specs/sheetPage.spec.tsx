import { screen } from "@testing-library/dom";
import { act } from "@testing-library/react";
import React from "react";
import { inventoryTableTestIds } from "../../../src/components/domain/SheetPage/InventorySheetTable";
import { basicSheetFixture } from "../../fixtures/sheetFixtures";
import Sheet, { sheetPageTestIds } from "../../../src/pages/sheets/[sheetId]";
import { checkTestIdsRender, renderTest } from "../../../src/utils/testUtils";
import createInventoryItem from "../../../src/utils/createInventoryItem";
import {
	getItemTotalValue,
	getItemTotalWeight,
} from "../../../src/utils/deriveItemProperties";

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
	 * @returns {Element} The cell elements
	 */
	const getCells = () =>
		document.querySelectorAll(
			`[data-testid="${inventoryTableTestIds.tableRoot}"] tbody tr td`
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
