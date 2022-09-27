import { useEffect } from "react";

export type IdentifiedObject =
	| {
			id: string;
	  }
	| {
			id: string;
	  };

export type OmitId<T extends IdentifiedObject> = Omit<T, "id" | "id">;

export type ReactEffect = Parameters<typeof useEffect>[0];

/**
 * Creates a deep copy of an object type, removing
 * the `readonly` modifier from all properties.
 */
export type Writable<T extends Record<string, any> | any[]> = {
	-readonly [Key in keyof T]: Writable<T[Key]>;
};

export type NonEmptyArray<T> = [T, ...T[]];

export type StrictExtract<Base, Sub extends Base> = Extract<Base, Sub>;
