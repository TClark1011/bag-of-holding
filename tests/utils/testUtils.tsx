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
