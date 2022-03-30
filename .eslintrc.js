module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true
	},
	extends: [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:@typescript-eslint/recommended",
		"thomas-clark"
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: 12,
		sourceType: "module"
	},
	plugins: ["react", "@typescript-eslint"],
	ignorePatterns: ["src/assets/**", "node_modules/**"],
	rules: {
		"react/react-in-jsx-scope": "off",
		"react/prop-types": "off",
		"jsdoc/require-param-type": "off",
		"jsdoc/require-returns-type": "off",
		"jsdoc/require-param": ["warn", { checkRestProperty: false }],
		"jsdoc/check-param-names": [
			"error" | "warn",
			{
				checkRestProperty: false
			}
		],
		"jsdoc/no-types": "error",
		"no-warning-comments": "warn",
		"@typescript-eslint/no-explicit-any": "off"
	}
};
