import { ReplaceValue } from "$root/types";
import { guardedIfElse } from "$root/utils/fpHelpers";
import { D, F, G } from "@mobily/ts-belt";
import { z } from "zod";
import type { ValueOf } from "type-fest";

/**
 * Create a function that can be used to ensure type safety
 * when setting untyped attributes for form fields
 *
 * @param schema The schema from which to pull keys
 * @returns A function that simply accepts and then returns
 * keys from the schema
 */
export const createSchemaKeyHelperFunction =
	<Schema extends z.ZodTypeAny>(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		schema: Schema // This is just here to get type inference
	) =>
	<SpecificKey extends keyof z.infer<Schema>>(key: SpecificKey) =>
		key;

/**
 * Go through an object's values and replace one value type
 * with another
 *
 * @param obj The object to go through
 * @param checker A type guard function used to check if a
 * value in the object is the type you want to replace
 * @param converter Takes the data of the type you want to
 * replace and outputs the data of the type you want to
 * replace it with.
 */
export const swapValueTypes = <
	Obj extends Record<string, unknown>,
	ToReplace,
	Replacement
>(
	obj: Obj,
	checker: (p: ValueOf<Obj> | unknown) => p is ToReplace,
	converter: (p: ToReplace) => Replacement
): ReplaceValue<Obj, ToReplace, Replacement> =>
	D.map(obj, guardedIfElse(checker, converter, F.identity as any)) as any;

/**
 * Convert all fields that are undefined in an object to null
 * Immutable.
 *
 * @param obj The object within which to do the conversions
 */
export const undefinedFieldsToNull = <T extends Record<string, any>>(obj: T) =>
	swapValueTypes(obj, G.isUndefined, () => null);
/**
 * Convert all fields that are null in an object to undefined.
 * Immutable.
 *
 * @param obj The object within which to do the conversions
 */
export const nullFieldsToUndefined = <T extends Record<string, any>>(obj: T) =>
	swapValueTypes(obj, G.isNull, () => undefined);
