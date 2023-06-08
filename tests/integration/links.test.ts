import { appGitLink, appSubredditLink } from "$root/constants";
import { test, expect } from "@playwright/test";

const trimQueryFromUrl = (url: string) => {
	const urlWithoutQuery = url.split("?")[0];
	return urlWithoutQuery;
};

test("Links", async ({ page, baseURL }) => {
	await page.goto("/");

	await page.click("#contact-link");

	await page.waitForURL(`${baseURL}/contact`);
	// expect(trimQueryFromUrl(page.url())).toBe(`${baseURL}/contact`);

	await page.click("#info-link");
	await page.waitForURL(`${baseURL}/info`);
	// expect(trimQueryFromUrl(page.url())).toBe(`${baseURL}/info`);

	await page.click("#home-link");
	await page.waitForURL(`${baseURL}`);
	// expect(trimQueryFromUrl(page.url())).toBe(`${baseURL}/`);

	// External Links

	await page.click("#git-link");
	expect(trimQueryFromUrl(page.url())).toBe(appGitLink);

	await page.goto("/");
	// Manually return to the home page

	await page.click("#reddit-link");
	expect(trimQueryFromUrl(page.url())).toBe(appSubredditLink);
});
