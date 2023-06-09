import { extendTheme, theme as defaultTheme } from "@chakra-ui/react";

/**
 * Generate array containing all the same values.
 * Required as textStyles must provide a full array
 * for values in order to override default styles
 * at all breakpoints
 *
 * @param value The value to fill
 * the array with
 * @returns The values
 */
const getResponsiveValues = <T>(value: T) => new Array<T>(4).fill(value, 0);

const theme = extendTheme({
	config: {
		initialColorMode: "system",
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
	semanticTokens: {
		colors: {
			shade: {
				"50": {
					default: "blackAlpha.50",
					_dark: "whiteAlpha.50",
				},
				"100": {
					default: "blackAlpha.100",
					_dark: "whiteAlpha.100",
				},
				"200": {
					default: "blackAlpha.200",
					_dark: "whiteAlpha.200",
				},
				"300": {
					default: "blackAlpha.300",
					_dark: "whiteAlpha.300",
				},
				"400": {
					default: "blackAlpha.400",
					_dark: "whiteAlpha.400",
				},
				"500": {
					default: "blackAlpha.500",
					_dark: "whiteAlpha.500",
				},
				"600": {
					default: "blackAlpha.600",
					_dark: "whiteAlpha.600",
				},
				"700": {
					default: "blackAlpha.700",
					_dark: "whiteAlpha.700",
				},
				"800": {
					default: "blackAlpha.800",
					_dark: "whiteAlpha.800",
				},
				"900": {
					default: "blackAlpha.900",
					_dark: "whiteAlpha.900",
				},
			},
		},
	},
});

export default theme;
