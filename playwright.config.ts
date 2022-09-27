import { PlaywrightTestConfig } from "@playwright/test";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const PORT = 3001;

const config: PlaywrightTestConfig = {
	testDir: "./tests/integration",
	outputDir: "./playwrightOutput",
	webServer: {
		command: "yarn start:dev",
		port: PORT,
		reuseExistingServer: !process.env.CI,
		timeout: 120 * 1000,
		env: {
			PORT: `${PORT}`,
		},
	},
	use: {
		actionTimeout: 10000,
	},
	retries: 3,
	reporter: process.env.CI ? "github" : "list",
	timeout: 60000,
	globalSetup: "./tests/setup/playwright.setup.ts",
	quiet: true,
};

export default config;
