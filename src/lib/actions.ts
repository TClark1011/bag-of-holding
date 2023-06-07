export type Action<Name extends string> = {
	type: Name;
};

export type PayloadAction<Name extends string, Payload> = Action<Name> & {
	payload: Payload;
};
