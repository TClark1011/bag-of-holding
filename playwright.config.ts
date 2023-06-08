import { defineConfig } from "@playwright/test";
import { loadEnvConfig } from "@next/env";
import isCI from "is-ci";

loadEnvConfig(process.cwd());

const PORT = 3001;

const vercelPreviewUrl = process.env.VERCEL_URL;

const baseURL = isCI ? vercelPreviewUrl : `http://localhost:${PORT}`;

console.log(
	"Playwright will run with the following base url: ",
	vercelPreviewUrl
);

const config = defineConfig({
	testDir: "./tests/integration",
	outputDir: "./playwrightOutput",
	webServer: isCI
		? undefined
		: {
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
		baseURL,
	},
	retries: 3,
	reporter: isCI ? "github" : "list",
	timeout: 60000,
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
