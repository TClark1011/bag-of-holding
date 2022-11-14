import { LiteralToPrimitive } from "type-fest";
import { z } from "zod";

type IsLiteral<T> = LiteralToPrimitive<T> extends T ? false : true;
// Primitives do not extend descended literals, so if the primitive
// version of a type extends its "literal" version, then its "literal"
// version must have actually been primitive

type RawStringToZod<Str extends string> = IsLiteral<Str> extends true
	? z.ZodLiteral<Str>
	: z.ZodString;

type RawObjectToZod<Obj extends Record<string, unknown>> = z.ZodObject<
	{
		[Key in keyof Obj]: RawToZod<Obj[Key]>;
	}
>;

/**
 * Take a base typescript type and convert it to the corresponding
 * zod schema type
 * NOTE: This will not work for union types eg; `string | number`
 */
export type RawToZod<T> = z.ZodType<never> &
	(T extends number
		? z.ZodNumber
		: T extends string
		? RawStringToZod<T>
		: T extends Record<string, unknown>
		? RawObjectToZod<T>
		: T extends (infer El)[]
		? z.ZodArray<RawToZod<El>>
		: T extends Date
		? z.ZodDate
		: T extends boolean
		? z.ZodBoolean
		: T extends undefined
		? z.ZodUndefined
		: T extends null
		? z.ZodNull
		: z.ZodType<unknown>);

/**
 * Use a zod schema as a typeguard
 *
 * @param data The data to check the type of
 * @param schema The schema to check against
 */
export function matchesSchema<Schema extends z.ZodTypeAny>(
	data: any,
	schema: Schema
): data is z.infer<Schema>;
/**
 * Use a zod schema as a typeguard (curried)
 *
 * @param schema The schema to check against
 * @returns a function that takes any data and returns
 * true/false to indicate if it matches the schema
 */
export function matchesSchema<Schema extends z.ZodTypeAny>(
	schema: Schema
): (data: any) => data is z.infer<Schema>;

/**
 * Use a zod schema as a type guard
 *
 * @param params Params
 */
export function matchesSchema<Schema extends z.ZodTypeAny>(
	...params: [any, Schema] | [Schema]
) {
	const [data, schema] = params.length === 2 ? params : [undefined, params[0]];
	const validator = schema.safeParse;
	return data !== undefined
		? validator(data).success
		: (data: any) => validator(data).success;
}
