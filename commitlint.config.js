// eslint-disable-next-line @typescript-eslint/no-var-requires
const { scopes } = require("./changelog.config");

module.exports = {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"scope-enum": [2, "always", scopes],
	},
};
