import { extendTheme, theme as defaultTheme } from "@chakra-ui/react";

/**
 * Generate array containing all the same values.
 * Required as textStyles must provide a full array
 * for values in order to override default styles
 * at all breakpoints
 *
 * @param {string | number} value The value to fill
 * the array with
 * @returns {string[] | number[]} The values
 */
const getResponsiveValues = <T>(value: T) => new Array(4).fill(value, 0);

const theme = extendTheme({
	config: {
		initialColorMode: "light",
	},
	textStyles: {
		h1: {
			fontSize: ["40px", "50px", "60px", "70px"],
			fontWeight: "extrabold",
			fontFamily: "coves",
		},
		//TODO: Need to buy the license for this (https://harvatt.house/store/coves-font) Before going commercial
		h2: {
			fontSize: getResponsiveValues("3xl"),
			fontWeight: 300,
		},
		h3: {
			fontSize: getResponsiveValues("2xl"),
			fontWeight: 700,
		},
	},
	fonts: {
		heading: "Roboto, sans-serif",
		body: "Roboto, sans-serif",
	},
	colors: {
		primary: defaultTheme.colors.blue,
		secondary: {
			"50": "#e6f2f2",
			"100": "#cef2f1",
			"200": "#aeebe9",
			"300": "#8de3df",
			"400": "#70d4cd",
			"500": "#5abab6",
			"600": "#50b3a9",
			"700": "#47a196",
			"800": "#3f8f85",
			"900": "#367a71",
		},
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
	sizes: {
		...defaultTheme.sizes,
		icon: defaultTheme.sizes[6],
	},
	components: {
		IconButton: {
			baseStyle: {
				borderRadius: "full",
			},
			defaultProps: {
				isRound: getResponsiveValues(true),
			},
		},
	},
});

export default theme;
