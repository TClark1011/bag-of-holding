module.exports = {
	testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
	testTimeout: 30000,
	projects: [
		{
			displayName: "frontend",
			rootDir: "tests/frontend",
			setupFilesAfterEnv: ["../../jest.setup.ts"],
		},
		{
			displayName: "backend",
			rootDir: "tests/backend",
			testEnvironment: "node",
			setupFilesAfterEnv: ["../../jest.setup.ts"],
		},
	],
};
