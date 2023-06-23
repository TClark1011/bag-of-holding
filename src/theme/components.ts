import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

/**
 * In some cases, in order to fully override default styles,
 * you need to provide a responsive value array containing
 * the same value for all breakpoints.
 */
const getResponsiveValues = <T>(value: T) => new Array<T>(4).fill(value, 0);

const modalLikeHelpers = createMultiStyleConfigHelpers(["overlay", "dialog"]);

const modalLikeComponentStyles = modalLikeHelpers.defineMultiStyleConfig({
	baseStyle: {
		overlay: {
			backdropFilter: "blur(4px)",
		},
		dialog: {
			boxShadow: "none",
		},
	},
});

const components = {
	IconButton: {
		baseStyle: {
			borderRadius: "full",
		},
		defaultProps: {
			isRound: getResponsiveValues(true),
		},
	},
	Modal: modalLikeComponentStyles,
	Drawer: modalLikeComponentStyles,
};

export default components;
