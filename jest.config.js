module.exports = {
	testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
	testTimeout: 10000,
	projects: [
		{
			displayName: "frontend",
			rootDir: "tests/frontend",
			setupFilesAfterEnv: ["../../jest.setup.ts"],
			testEnvironment: "jsdom",
		},
		{
			displayName: "backend",
			rootDir: "tests/backend",
			testEnvironment: "node",
			setupFilesAfterEnv: ["../../jest.setup.ts"],
		},
	],
};
