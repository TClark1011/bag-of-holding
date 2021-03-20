import { extendTheme, theme as defaultTheme } from "@chakra-ui/react";

const theme = extendTheme({
	colors: {
		primary: defaultTheme.colors.orange,
		secondary: defaultTheme.colors.cyan,
		error: defaultTheme.colors.red,
		warning: defaultTheme.colors.yellow,
		success: defaultTheme.colors.yellow,
	},
	space: {
		...defaultTheme.space,
		group: defaultTheme.space[2],
		break: defaultTheme.space[6],
	},
});

export default theme;
