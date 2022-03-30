import { act, screen } from "@testing-library/react";
import { contactEmailAddress } from "$root/constants";
import ContactPage, { contactPageTitle } from "$root/pages/contact";
import { renderTest } from "../../utils/testUtils";

test("Elements Render", () => {
	act(() => {
		renderTest(<ContactPage />);
	});

	expect(screen.getByText(contactPageTitle)).toBeVisible();
	expect(screen.getByText(contactEmailAddress)).toBeVisible();
});
