import { act, screen } from "@testing-library/react";
import InfoPage, { infoPageTestIds } from "../../../pages/info";
import { renderTest } from "../../../utils/testUtils";

test("Renders required elements", () => {
	act(() => {
		renderTest(<InfoPage />);
	});

	Object.values(infoPageTestIds).forEach((item) => {
		expect(screen.getByTestId(item)).toBeVisible();
	});
});
