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
 * @param schema The schema
 * @param value The value to check
 */
export const matchesSchema = <Schema extends z.ZodTypeAny>(
	schema: Schema,
	value: any
): value is z.infer<Schema> => schema.safeParse(value).success;

/**
 * Curried version of `matchesSchema`
 *
 * @param schema The schema
 */
export const _matchesSchema = <Schema extends z.ZodTypeAny>(schema: Schema) => (
	value: any
): value is z.infer<Schema> => schema.safeParse(value).success;
