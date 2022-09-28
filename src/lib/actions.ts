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

/**
 * Take a zod schema and wrap it in a PayloadAction schema.
 *
 * @param schema The schema to wrap
 */
export const asActionSchema = <Schema extends z.ZodTypeAny>(schema: Schema) =>
	z.object({
		actionId: z.string(),
		payload: schema,
	});
