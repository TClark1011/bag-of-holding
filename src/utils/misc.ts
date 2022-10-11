import { z } from "zod";

/**
 * Create a function that can be used to ensure type safety
 * when setting untyped attributes for form fields
 *
 * @param schema The schema from which to pull keys
 * @returns A function that simply accepts and then returns
 * keys from the schema
 */
export const createSchemaKeyHelperFunction = <Schema extends z.ZodTypeAny>(
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	schema: Schema // This is just here to get type inference
) => (key: keyof z.infer<Schema>) => key;
