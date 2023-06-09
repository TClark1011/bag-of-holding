/**
 * Playwright config for running against a live server
 */
import { loadEnvConfig } from "@next/env";
import { defineConfig } from "@playwright/test";
import { z } from "zod";

loadEnvConfig(process.cwd());

const URL = z.string().url().parse(process.env.LIVE_URL);

z.string().parse(process.env.TESTING_ADMIN_KEY);
// Makes sure the admin key env variable is set

const config = defineConfig({
	testDir: "./tests/integration",
	outputDir: "./playwrightOutput",
	grepInvert: /Maintenance/g,
	// We can't test maintenance mode against a live server
	// because we can't run it in maintenance mode
	timeout: 60000,
	reporter: "list",

	use: {
		baseURL: URL,
		actionTimeout: 10 * 1000,
	},
	retries: 3,
});

export default config;
