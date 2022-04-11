import { PlaywrightTestConfig } from "@playwright/test";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const config: PlaywrightTestConfig = {
	testDir: "./tests/integration",
	outputDir: "./playwrightOutput",
	webServer: {
		command: "PORT=3001 yarn start:dev",
		port: 3001,
		reuseExistingServer: !process.env.CI,
	},
	timeout: 60000,
	globalSetup: "./tests/setup/playwright.setup.ts",
	quiet: true,
};

export default config;
