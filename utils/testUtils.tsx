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
interface ElementQueryOptions {
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

/**
 * Function for easily testing that all of a components elements
 * render.
 * Iterates through an array of provided queries (see query type
 * above), and checks that elements described by those queries
 * are rendering.
 *
 * @param {ReactElement} component The component to test
 * @param {ElementQueryOptions[]} queries The queries to execute
 */
export const testElementRenders = (
	component: React.ReactElement,
	queries: ElementQueryOptions[]
): void => {
	describe("Elements render correctly", () => {
		for (const { mode, query, searchIn, elementName, multiple } of queries) {
			test(elementName, () => {
				const container = renderTest(component);
				const searchObject =
					searchIn && searchIn === "container" ? container : screen;
				const result = {
					text: multiple
						? searchObject.queryAllByText(query)
						: searchObject.queryByText(query),
					testId: multiple
						? searchObject.queryAllByTestId(query)
						: searchObject.queryByTestId(query),
					displayValue: multiple
						? searchObject.queryAllByDisplayValue(query)
						: searchObject.queryByDisplayValue(query),
					placeholderText: multiple
						? searchObject.queryAllByPlaceholderText(query)
						: searchObject.queryByPlaceholderText(query),
					labelText: multiple
						? searchObject.queryAllByLabelText(query)
						: searchObject.queryByLabelText(query),
					altText: multiple
						? searchObject.queryAllByAltText(query)
						: searchObject.queryByAltText(query),
					role: multiple
						? searchObject.queryAllByRole(query)
						: searchObject.queryByRole(query),
					title: multiple
						? searchObject.queryAllByTitle(query)
						: searchObject.queryByTitle(query),
				}[mode || "testId"];
				if (Array.isArray(result)) {
					expect(result.length).toBeTruthy();
					for (const el of result) {
						expect(el).toBeInTheDocument();
					}
				} else {
					expect(result).toBeInTheDocument();
				}
			});
		}
	});
};
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
 * @param props The props
 * @param props.stateObject The hookstate state object to merge into
 * @param props.data The object to merge into the hookstate object
 * @returns Renders nothing
 */
export const StateMergeMock: React.FC<StateMergeMockProps> = ({
	stateObject,
	data,
}) => {
	const state = useHookstate(stateObject);
	state.merge(data);
	return <></>;
};

/**
 * Generate a component that will generate test-ids to pass
 * to element
 *
 * @param componentName The name of the component to generate
 * test ids for
 * @returns A function that generates a test-id using a provided
 * label string
 */
export const testIdGeneratorFactory = (
	componentName: string
): ((a: string) => string) => (label: string) => componentName + "__" + label;
