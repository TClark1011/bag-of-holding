import { act, screen } from "@testing-library/react";
import { contactEmailAddress } from "../../../src/constants/branding";
import ContactPage, { contactPageTitle } from "../../../src/pages/contact";
import { renderTest } from "../../../src/utils/testUtils";

test("Elements Render", () => {
	act(() => {
		renderTest(<ContactPage />);
	});

	expect(screen.getByText(contactPageTitle)).toBeVisible();
	expect(screen.getByText(contactEmailAddress)).toBeVisible();
});
