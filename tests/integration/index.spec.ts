import { appGitLink, appSubredditLink } from "$root/constants";
import formatColorString from "$tests/utils/formatColorString";
import { flow } from "@mobily/ts-belt";
import { test, expect } from "@playwright/test";

test("Links", async ({ page, baseURL }) => {
	await page.goto("/");

	await page.click("#contact-link");
	expect(page.url()).toBe(`${baseURL}/contact`);

	await page.click("#info-link");
	expect(page.url()).toBe(`${baseURL}/info`);

	await page.click("#home-link");
	expect(page.url()).toBe(`${baseURL}/`);

	// External Links

	await page.click("#git-link");
	expect(page.url()).toBe(appGitLink);

	await page.goto("/");
	// Manually return to the home page

	await page.click("#reddit-link");
	expect(page.url()).toBe(appSubredditLink);
});

test.describe("Color Modes", () => {
	// Background colors used in the light/dark color schemes
	const DARK = "#1A202C";
	const LIGHT = "#FFFFFF";

	test("No Preference", async ({ page }) => {
		// Light theme colors should be used if user has no preference
		await page.emulateMedia({ colorScheme: "no-preference" });
		await page.goto("/");

		const rootEl = await page.waitForSelector("#__next");
		const rootBackgroundColor = await rootEl.evaluate((el) =>
			window.getComputedStyle(el).getPropertyValue("background-color")
		);

		expect(formatColorString(rootBackgroundColor)).toBe(LIGHT);
	});

	test("Light", async ({ page }) => {
		await page.emulateMedia({ colorScheme: "light" });
		await page.goto("/");

		const colorMode = await page.getAttribute("html", "data-theme");
		expect(colorMode).toBe("light");

		const rootEl = await page.waitForSelector("#__next");
		const rootBackgroundColor = await rootEl.evaluate((el) =>
			window.getComputedStyle(el).getPropertyValue("background-color")
		);

		expect(formatColorString(rootBackgroundColor)).toBe(LIGHT);
	});

	test("Dark", async ({ page }) => {
		await page.emulateMedia({ colorScheme: "dark" });
		await page.goto("/");

		const colorMode = await page.getAttribute("html", "data-theme");
		expect(colorMode).toBe("dark");

		const rootEl = await page.waitForSelector("#__next");
		const rootBackgroundColor = await rootEl.evaluate((el) =>
			window.getComputedStyle(el).getPropertyValue("background-color")
		);

		expect(formatColorString(rootBackgroundColor)).toBe(DARK);
	});

	test("No preference, switch modes", async ({ page }) => {
		const getBackgroundColor = flow(
			() => page.waitForSelector("#__next"),
			async (rootEl) =>
				(await rootEl).evaluate((el) =>
					window.getComputedStyle(el).getPropertyValue("background-color")
				),
			async (color) => formatColorString(await color)
		);

		await page.emulateMedia({ colorScheme: "no-preference" });
		await page.goto("/");

		await page.click("#color-switch");
		expect(await getBackgroundColor()).toBe(DARK);

		await page.reload();
		expect(await getBackgroundColor()).toBe(DARK);

		await page.click("#color-switch");
		expect(await getBackgroundColor()).toBe(LIGHT);

		await page.reload();
		expect(await getBackgroundColor()).toBe(LIGHT);
	});

	test("Dark Preference, switch mode", async ({ page }) => {
		const getBackgroundColor = flow(
			() => page.waitForSelector("#__next"),
			async (rootEl) =>
				(await rootEl).evaluate((el) =>
					window.getComputedStyle(el).getPropertyValue("background-color")
				),
			async (color) => formatColorString(await color)
		);

		await page.emulateMedia({ colorScheme: "dark" });
		await page.goto("/");

		await page.click("#color-switch");
		expect(await getBackgroundColor()).toBe(LIGHT);

		await page.reload();
		expect(await getBackgroundColor()).toBe(LIGHT);
	});
});
