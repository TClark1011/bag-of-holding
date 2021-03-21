import { extendTheme, theme as defaultTheme } from "@chakra-ui/react";

const theme = extendTheme({
	colors: {
		// primary: defaultTheme.colors.orange,
		primary: {
			"50": "#fceae8",
			"100": "#fcc6c2",
			"200": "#f79d97",
			"300": "#f06e67",
			"400": "#e84943",
			"500": "#f74336",
			"600": "#cf2525",
			"700": "#bf2123",
			"800": "#b31d1f",
			"900": "#a31a1f",
		},
		secondary: defaultTheme.colors.cyan,
		// error: defaultTheme.colors.red,
		error: {
			"50": "#ffe7e6",
			"100": "#ffbcb8",
			"200": "#fa8c84",
			"300": "#f25850",
			"400": "#eb2c26",
			"500": "#fc1a09",
			"600": "#d10606",
			"700": "#c20205",
			"800": "#b50003",
			"900": "#a60006",
		},
		warning: defaultTheme.colors.yellow,
		success: defaultTheme.colors.green,
	},
	space: {
		...defaultTheme.space,
		group: defaultTheme.space[2],
		break: defaultTheme.space[6],
	},
});

export default theme;
