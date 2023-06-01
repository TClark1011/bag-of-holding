import cuid from "cuid";
import { ValueOf } from "type-fest";
import { z } from "zod";

export type Action<Name extends string> = {
	type: Name;
};

export type PayloadAction<Name extends string, Payload> = Action<Name> & {
	payload: Payload;
};

export type ResolvedAction<TheAction extends Action<string>> = {
	resolved: true;
	id: string;
	type: TheAction["type"];
	originalAction: TheAction;
};

export type ResolvedPayloadAction<
	TheAction extends Action<string>,
	Payload
> = ResolvedAction<TheAction> & {
	resolvedPayload: Payload;
};

export type ResolveMultipleActions<Actions extends Action<string>> = ValueOf<{
	[ActionType in Actions["type"]]: {
		resolved: true;
		id: string;
		type: ActionType;
		originalAction: Extract<Actions, { type: ActionType }>;
	};
}>;

export type ExtractResolvedPayloadActions<
	Actions extends ResolvedPayloadAction<any, any>
> = Extract<Actions, { resolvedPayload: any }>;

/**
 * Generate a zod schema for a reducer action
 *
 * @param name The name of the action
 */
export const actionSchema = <TypeName extends string>(name: TypeName) =>
	z.object({
		type: z.literal(name),
	});

/**
 * Generate a schema for a payload action
 *
 * @param typeName The name of the type
 * @param payloadSchema The schema for the payload
 */
export const payloadActionSchema = <
	TypeName extends string,
	PayloadSchema extends z.ZodTypeAny
>(
	typeName: TypeName,
	payloadSchema: PayloadSchema
) =>
	actionSchema(typeName).extend({
		payload: payloadSchema,
	});

export type ExtractResolvedActions<Actions extends Action<string>> = Extract<
	Actions,
	{ resolved: true }
>;

export type ExtractUnresolvableActions<Actions extends Action<string>> =
	Exclude<Actions, { type: ExtractResolvedActions<Actions>["type"] }>;

export type ExtractResolvableActions<TheAction extends Action<string>> =
	Exclude<
		TheAction,
		ExtractUnresolvableActions<TheAction> | ExtractResolvedActions<TheAction>
	>;

export type FinalActions<Actions extends Action<string>> =
	| ExtractResolvedActions<Actions>
	| ResolveMultipleActions<ExtractUnresolvableActions<Actions>>;

export type ExtractPayloadActions<TheAction extends Action<string>> = Extract<
	TheAction,
	{ payload: any }
>;

/**
 * Resolve a simple (non-payload) action
 *
 * @param action The action to resolve
 * @param id The id of the action, if not provided then one
 * is generated
 */
export const resolveSimpleAction = <TheAction extends Action<string>>(
	action: TheAction,
	id = cuid()
): ResolvedAction<TheAction> => ({
	resolved: true,
	id,
	type: action.type,
	originalAction: action,
});

export const staticResolvedActionSchemaFields = z.object({
	id: z.string(),
	resolved: z.literal(true),
});
