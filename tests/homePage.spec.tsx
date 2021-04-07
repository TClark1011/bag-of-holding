import { act, screen } from "@testing-library/react";
import { appDisplayTitle, appSlogan } from "../constants/branding";
import Home from "../pages";
import { renderTest } from "../utils/testUtils";

test("Elements render", () => {
	act(() => {
		renderTest(<Home />);
	});
	expect(screen.getByText("Get Started")).toBeInTheDocument();
	expect(screen.getByText(appSlogan)).toBeInTheDocument();
	expect(screen.getByText(appDisplayTitle)).toBeInTheDocument();
});
