import { defineConfig } from "@playwright/test";
import { loadEnvConfig } from "@next/env";
import isCI from "is-ci";

loadEnvConfig(process.cwd());

const PORT = 3001;

const config = defineConfig({
	testDir: "./tests/integration",
	outputDir: "./playwrightOutput",
	webServer: {
		command: "yarn start:dev",
		port: PORT,
		reuseExistingServer: !isCI,
		timeout: 120 * 1000,
		env: {
			PORT: `${PORT}`,
		},
	},
	use: {
		actionTimeout: 10 * 1000,
		baseURL: `http://localhost:${PORT}`,
	},
	retries: 3,
	reporter: isCI ? "junit" : "list",
	timeout: isCI ? 180 * 1000 : 60 * 1000,
	quiet: true,
	projects: [
		{
			name: "normal",
			grepInvert: /Maintenance/g,
		},
		{
			name: "maintenance",
			grep: /Maintenance/,
		},
	],
});

export default config;
