import colors from "$root/theme/colors";
import components from "$root/theme/components";
import semanticTokens from "$root/theme/semanticTokens";
import { extendTheme, theme as defaultTheme } from "@chakra-ui/react";

const theme = extendTheme({
	config: {
		initialColorMode: "system",
	},
	fonts: {
		heading: "Roboto, sans-serif",
		body: "Roboto, sans-serif",
	},
	colors,
	space: {
		...defaultTheme.space,
		group: defaultTheme.space[2],
		break: defaultTheme.space[6],
	},
	sizes: {
		...defaultTheme.sizes,
		icon: defaultTheme.sizes[6],
	},
	components,
	layerStyles: {
		glassBlurBackdrop: {
			backdropFilter: "blur(4px)",
		},
	},
	semanticTokens,
});

export default theme;
