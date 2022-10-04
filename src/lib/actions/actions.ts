import { RawToZod } from "$zodHelpers";
import { z } from "zod";

export type Action<Name extends string> = {
	type: Name;
};

export type PayloadAction<Name extends string, Payload> = Action<Name> & {
	payload: Payload;
};

export type ResolvedAction<
	Name extends string,
	ResolvedPayload
> = PayloadAction<Name, ResolvedPayload> & {
	actionId: string;
};

export type ResolvedActionFromUnresolved<
	ActionToResolve extends Action<string>,
	ResolvedPayload
> = ResolvedAction<ActionToResolve["type"], ResolvedPayload>;

export type SimpleResolvedActionFromUnresolvedWithPayload<
	ActionToResolve extends PayloadAction<string, any>
> = ResolvedActionFromUnresolved<ActionToResolve, ActionToResolve["payload"]>;

/**
 * @param name
 */
export const actionSchema = <TypeName extends string>(name: TypeName) =>
	z.object({
		type: z.literal(name),
	});

/**
 * @param typeName
 * @param payloadSchema
 */
export const payloadActionSchema = <
	TypeName extends string,
	PayloadSchema extends z.ZodTypeAny
>(
		typeName: TypeName,
		payloadSchema: PayloadSchema
	) =>
		z.object({
			...actionSchema(typeName).shape,
			payload: payloadSchema,
		});

/**
 * Take a zod schema and wrap it in a PayloadAction schema.
 *
 * @param schema The schema to wrap
 */
export const asResolvedActionSchema = <Schema extends z.ZodTypeAny>(
	schema: Schema
) =>
		z.object({
			actionId: z.string(),
			payload: schema,
		});

export const withActionIdSchema = z.object({
	actionId: z.string(),
});

export type ExtractResolvedActions<Actions extends Action<string>> = Extract<
	Actions,
	{ actionId: string }
>;

export type ExcludeResolvableActions<Actions extends Action<string>> = Exclude<
	Actions,
	{ type: ExtractResolvedActions<Actions>["type"] }
>;

export type FinalActions<Actions extends Action<string>> =
	| ExtractResolvedActions<Actions>
	| ExcludeResolvableActions<Actions>;
