import {
	Action,
	PayloadAction,
	ResolvedAction,
	ResolvedActionFromUnresolved,
} from "$actions";
import { Opaque, ValueOf } from "type-fest";

type NO_PAYLOAD = Opaque<"NoPayload", "--NO_PAYLOAD--">;
type RESOLVED_PAYLOAD = Opaque<"ResolvedPayload", "--RESOLVED_PAYLOAD--">;

type WithResolvedPayload<
	UnresolvedPayload,
	ResolvedPayload = UnresolvedPayload
> = (UnresolvedPayload | ResolvedPayload) & RESOLVED_PAYLOAD;

type GetActionsFromWithResolvedPayload<
	TypeName extends string,
	Payloads extends WithResolvedPayload<any, any>
> = Payloads extends WithResolvedPayload<infer Unresolved, infer Resolved>
	?
			| PayloadAction<TypeName, Unresolved>
			| ResolvedActionFromUnresolved<
					PayloadAction<TypeName, Unresolved>,
					Resolved
			  >
	: never;

type InferActionsFromObject<
	ObjectActions extends Record<string, unknown>
> = ValueOf<
	{
		[Key in keyof ObjectActions & string]: ObjectActions[Key] extends NO_PAYLOAD
			? Action<Key>
			: ObjectActions[Key] extends WithResolvedPayload<any, any>
			? GetActionsFromWithResolvedPayload<Key, ObjectActions[Key]>
			: PayloadAction<Key, ObjectActions[Key]>;
	}
>;

type MyActions = InferActionsFromObject<{
	increment: NO_PAYLOAD;
	decrement: NO_PAYLOAD;
	set: number;
	create: WithResolvedPayload<{ name: string }, { id: string; name: string }>;
}>;

type MyUnresolvableActions = Exclude<
	MyActions,
	{ type: Extract<MyActions, ResolvedAction<any, any>>["type"] }
>;
