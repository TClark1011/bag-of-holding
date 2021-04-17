import { act, screen } from "@testing-library/react";
import { contactEmailAddress } from "../../../constants/branding";
import ContactPage, { contactPageTitle } from "../../../pages/contact";
import { renderTest } from "../../../utils/testUtils";

test("Elements Render", () => {
	act(() => {
		renderTest(<ContactPage />);
	});

	expect(screen.getByText(contactPageTitle)).toBeVisible();
	expect(screen.getByText(contactEmailAddress)).toBeVisible();
});
