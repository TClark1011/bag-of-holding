import { useEffect } from "react";

export type IdentifiedObject = {
	id: string;
};

export type OmitId<T extends IdentifiedObject> = Omit<T, "id" | "id">;

export type ReactEffect = Parameters<typeof useEffect>[0];

export type NonEmptyArray<T> = [T, ...T[]];

export type StrictExtract<Base, Sub extends Base> = Extract<Base, Sub>;

export type Updater<T> = (prev: T) => T;
