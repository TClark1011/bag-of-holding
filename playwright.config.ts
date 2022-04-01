import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
	testDir: "./tests/integration",
	webServer: {
		command: "PORT=3001 yarn start:dev",
		port: 3001,
		reuseExistingServer: !process.env.CI,
	},
};

export default config;
