import { screen } from "@testing-library/dom";
import { act } from "@testing-library/react";
import React from "react";
import { inventoryTableTestIds } from "../../components/domain/SheetPage/InventorySheetTable";
import { basicSheetFixture } from "../../fixtures/sheetFixtures";
import Sheet, { sheetPageTestIds } from "../../pages/sheets/[sheetId]";
import { checkTestIdsRender, renderTest } from "../../utils/testUtils";

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
			expect(screen.getAllByText(member)).toBeTruthy();
		});
	});

	test("Items", () => {
		act(() => {
			renderTest(basicSheetJsx);
		});
		items.forEach(({ name, weight, quantity, value }) => {
			expect(screen.getByText(name)).toBeInTheDocument();
			expect(screen.getAllByText(weight * quantity + "")).toBeTruthy();
			expect(screen.getAllByText(value * quantity + "")).toBeTruthy();
			expect(screen.getAllByText(quantity + "")).toBeTruthy();
		});
	});
});
