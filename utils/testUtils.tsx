import {
	render,
	RenderOptions,
	RenderResult,
	screen,
} from "@testing-library/react";
import React from "react";
import { StateMethods, useHookstate } from "@hookstate/core";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "../config/theme";

/**
 * Component containing all providers required for the application
 *
 * @param {object} props Component Props
 * @param {ReactNode} props.children Component children
 * @returns {ReactNode} The rendered ReactNode
 */
const AllProviders: React.FC = ({ children }) => (
	<ChakraProvider theme={theme}>
		<ColorModeScript initialColorMode={theme.config.initialColorMode} />
		{children}
	</ChakraProvider>
);

/**
 * A function for rendering tests
 * All required providers are passed as the wrapper
 *
 * @param {ReactElement} jsx The jsx code to render in the test
 * @param {RenderOptions} options The options to pass to the render function
 * @returns {RenderResult} The result of running the render, passing 'AllProviders'
 * as the wrapper option as well as all other provided options
 */
export const renderTest = (
	jsx: React.ReactElement,
	options?: RenderOptions
): RenderResult => render(jsx, { wrapper: AllProviders, ...options });

/**
 * @typedef {string} ElementQueryMode The mode of the element query, must be equal
 * to one of the following: "text", "testId", "displayValue", "placeholderText",
 * "labelText", "altText", "title", "role"
 *
 * @typedef {Object} ElementQueryOptions Defines how to query for an element
 * to test that it has rendered.
 * NOTE: All described default values refer to the value that is used in
 * the 'testElementRenders' function if that property is not defined
 * @property {ElementQueryMode} [mode="testId"] The property to query for. In
 * 'testElementRenders' this property will default to "testId"
 * @property {"screen" | "container"} [searchIn="screen"] The object to query for
 * the element in
 * @property {boolean} [multiple=false] Whether to expect multiple elements to match
 * the query.
 * @property {string} query The actual query for searching for the element
 */
export interface ElementQueryOptions {
	mode?:
		| "text"
		| "testId"
		| "displayValue"
		| "placeholderText"
		| "labelText"
		| "altText"
		| "title"
		| "role";
	searchIn?: "screen" | "container";
	multiple?: boolean;
	query: string;
	elementName: string;
}

export interface StateMergeMockProps<
	// eslint-disable-next-line @typescript-eslint/ban-types
	T extends Record<string, unknown> = {}
> {
	data: T;
	stateObject: StateMethods<T>;
}
/**
 * A component that merges passed data with a provided state object
 *
 * @param {object} props The props
 * @param {StateMethods} props.stateObject The hookstate state object to merge into
 * @param {unknown} props.data The object to merge into the hookstate object
 * @returns {null} Renders nothing
 */
export const StateMergeMock: React.FC<StateMergeMockProps> = ({
	stateObject,
	data,
}) => {
	const state = useHookstate(stateObject);
	state.merge(data);
	return null;
};

/**
 * Generate a component that will generate test-ids to pass
 * to element
 *
 * @param {string} componentName The name of the component to generate
 * test ids for
 * @returns {Function} A function that generates a test-id using a provided
 * label string
 */
export const testIdGeneratorFactory = (
	componentName: string
): ((a: string) => string) => (label: string) => componentName + "__" + label;

/**
 * Check that components with provided test ids are
 * rendering
 *
 * @param {Record<string,string>} testIds Object containing testIds as
 * the values.
 */
export const checkTestIdsRender = (testIds: Record<string, string>): void => {
	Object.values(testIds).forEach((testId) => {
		expect(screen.getByTestId(testId)).toBeInTheDocument();
	});
};
