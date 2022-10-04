# Actions

This internal lib defines standard `Action` types to use in redux-style state management, but it also defines the typings for a pattern I like to call "Resolved Actions"

## Resolved Actions

Sometimes the payload of an action will need to have extra data added to it, or be transformed in some way, before it can be sent to the store. I have named the process of this "resolution" and an action that has had that process performed on it is considered "resolved".

An example of action resolution:

1. An action to create a character is dispatched, the type of its payload is as follows:

```ts
type BaseCreateCharacterPayload = {
	name: string;
	carryCapacity: number;
};
```

2. For this to be used in the UI and/or be sent to the server it needs to have an `id` generated, and the id of the sheet its in added to the `sheetId` field. The process of adding these fields in is the resolution. The resolved payload type looks like this:

```ts
type ResolvedCreateCharacterPayload = {
	id: string;
	sheetId: string;
	name: string;
	carryCapacity: number;
};
```

So when the action was first dispatched it just had `name` and `carryCapacity`, then we resolve that action by generating a value to use for `id` and pulling the id for `sheetId` out of global state.

### Identification

As well as having their payloads transformed, the other important change that happens to actions when they get resolved is they have a new field added (to the root, NOT the payload) named `actionId`. The idea behind `actionId` is that if the resolved action needs to be sent to the server, that `actionId` will get sent with it, then when the server sends a corresponding update out via websockets, that event will also contain that `actionId`.

When a store dispatches a resolved action, it should keep track of the ids of all the actions it has dispatched. Then, when it receives an event via websockets, it can check the `actionId` of the websockets event, and then check if it already processed that event as an optimistic update and skip it if it already did.
