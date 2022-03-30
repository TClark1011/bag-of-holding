/* eslint-disable jsdoc/require-jsdoc  */
/* eslint-disable jsdoc/require-param  */
/* eslint-disable jsdoc/require-returns  */
import {
	Heading,
	HeadingProps,
	Text,
	TextProps,
	chakra,
} from "@chakra-ui/react";

type HeadingComponent = React.FC<HeadingProps>;

export const H1: HeadingComponent = (props) => (
	<Heading
		as="h1"
		fontSize={["40px", "50px", "60px", "70px"]}
		fontFamily="Coves"
		fontWeight="extrabold"
		{...props}
	/>
);

export const H2: HeadingComponent = (props) => (
	<Heading as="h2" fontSize="3xl" fontWeight={300} {...props} />
);

export const H3: HeadingComponent = (props) => (
	<Heading as="h3" fontSize="2xl" fontWeight={700} {...props} />
);

export const Paragraph: React.FC<TextProps> = (props) => (
	<Text as="p" width="full" marginBottom={6} {...props} />
);

/**
 * Titles of sections/pages, such as "Info" and "Contact"
 */
export const SectionTitle = chakra(H2, {
	baseStyle: { textAlign: "center", marginBottom: "break" },
});
