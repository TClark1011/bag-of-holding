/* eslint-disable @typescript-eslint/no-var-requires */
const { pipe, D, A } = require("@mobily/ts-belt");
const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig");
const { config: configureEnv } = require("dotenv-flow");
// configureEnv({});

// The order that the "paths" keys need to be in
// order for jest to be able to resolve the imports
const requiredPathsKeyOrder = ["$root/*", "$tests/*", "$*"];

const orderedKeys = pipe(
	compilerOptions.paths,
	D.toPairs,
	A.sortBy(([key]) => requiredPathsKeyOrder.indexOf(key)),
	D.fromPairs
);

const config = {
	preset: "ts-jest",
	moduleNameMapper: pathsToModuleNameMapper(orderedKeys, {
		prefix: "<rootDir>/../../",
	}),
	setupFilesAfterEnv: ["<rootDir>/../setup/jest.setup.ts"],
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
