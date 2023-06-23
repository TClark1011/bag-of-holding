import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

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
	Modal: modalLikeComponentStyles,
	Drawer: modalLikeComponentStyles,
};

export default components;
