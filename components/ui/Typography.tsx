/* eslint-disable jsdoc/require-jsdoc */
import { Heading, HeadingProps } from "@chakra-ui/layout";

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
