import { extendTheme, theme as defaultTheme } from "@chakra-ui/react";

const theme = extendTheme({
	colors: {
		...defaultTheme.colors,
		main: defaultTheme.colors.orange,
	},
	space: {
		...defaultTheme.space,
		group: defaultTheme.space[2],
		break: defaultTheme.space[6],
	},
});

export default theme;
