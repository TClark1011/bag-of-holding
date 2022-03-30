import { act, screen } from "@testing-library/react";
import { appDisplayTitle, appSlogan } from "$root/constants";
import Home, { homePageTestIds } from "$root/pages/index";
import { checkTestIdsRender, renderTest } from "../../utils/testUtils";

test("Contains required elements", () => {
	act(() => {
		renderTest(<Home />);
	});
	expect(screen.getByText("Get Started")).toBeInTheDocument();
	expect(screen.getByText("What is this?")).toBeInTheDocument();
	expect(screen.getByText(appSlogan)).toBeInTheDocument();
	expect(screen.getByText(appDisplayTitle)).toBeInTheDocument();

	checkTestIdsRender(homePageTestIds);

	Object.values(homePageTestIds).forEach((item) => {
		expect(screen.getByTestId(item)).toBeVisible();
	});
});
