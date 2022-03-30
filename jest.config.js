/* eslint-disable @typescript-eslint/no-var-requires */
const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig");

const config = {
	preset: "ts-jest",
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
		prefix: "<rootDir>/../../",
	}),
	setupFilesAfterEnv: ["../../jest.setup.ts"],
};

module.exports = {
	testTimeout: 10000,
	projects: [
		{
			displayName: "frontend",
			rootDir: "./tests/frontend",
			testEnvironment: "jsdom",
			...config,
		},
		{
			displayName: "backend",
			rootDir: "./tests/backend",
			testEnvironment: "node",
			...config,
		},
	],
};
