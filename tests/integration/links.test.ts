import { appGitLink, appSubredditLink } from "$root/constants";
import { test } from "@playwright/test";

test.describe.configure({
	mode: "parallel",
	timeout: 30 * 1000,
});

test.beforeEach(async ({ page }) => {
	await page.goto("/");
});

type LinkListing = {
	title: string;
	linkId: string;
	expectedUrl: string;
};

const linkListings: LinkListing[] = [
	{
		title: "Contact",
		linkId: "#contact-link",
		expectedUrl: "/contact",
	},
	{
		title: "Info",
		linkId: "#info-link",
		expectedUrl: "/info",
	},
	{
		title: "Home",
		linkId: "#home-link",
		expectedUrl: "/",
	},
	{
		title: "GitHub",
		linkId: "#git-link",
		expectedUrl: `${appGitLink}*`,
	},
	{
		title: "Reddit",
		linkId: "#reddit-link",
		expectedUrl: `${appSubredditLink}*`,
	},
];

linkListings.forEach(({ title, linkId, expectedUrl }) =>
	test(title, async ({ page }) => {
		await page.click(linkId);
		await page.waitForURL(expectedUrl);
	})
);
