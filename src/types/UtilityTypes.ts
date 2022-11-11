import { useEffect } from "react";

export type IdentifiedObject = {
	id: string;
};

export type OmitId<T extends IdentifiedObject> = Omit<T, "id" | "id">;

export type ReactEffect = Parameters<typeof useEffect>[0];

export type NonEmptyArray<T> = [T, ...T[]];

export type StrictExtract<Base, Sub extends Base> = Extract<Base, Sub>;

export type Updater<T> = (prev: T) => T;

export type ReplaceValue<
	Obj extends Record<string, unknown>,
	ValueToReplace,
	ReplacementValue
> = {
	[Key in keyof Obj]: Exclude<Obj[Key], ValueToReplace> | ReplacementValue;
};

type A = {
	a: number | null | undefined;
};

type B = ReplaceValue<A, undefined, null>;
