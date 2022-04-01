import { appGitLink, appSubredditLink } from "$root/constants";
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
