import { defineConfig } from "@playwright/test";
import { loadEnvConfig } from "@next/env";
import isCI from "is-ci";

loadEnvConfig(process.cwd());

const PORT = 3001;

const config = defineConfig({
	testDir: "./tests/integration",
	outputDir: "./playwrightOutput",
	preserveOutput: "failures-only",
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
		screenshot: "only-on-failure",
		video: {
			mode: "on-first-retry",
			size: {
				height: 900,
				width: 900,
			},
		},
	},
	retries: 2,
	reporter: isCI ? "github" : "list",
	timeout: 180 * 1000,
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
