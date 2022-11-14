import { useEffect } from "react";

export type IdentifiedObject = {
	id: string;
};

export type OmitId<T extends IdentifiedObject> = Omit<T, "id" | "id">;

export type ReactEffect = Parameters<typeof useEffect>[0];

export type NonEmptyArray<T> = [T, ...T[]];

export type StrictExtract<Base, Sub extends Base> = Extract<Base, Sub>;

export type Updater<T> = (prev: T) => T;

// export type ReplaceValue<
// 	Obj extends Record<string, unknown>,
// 	ValueToReplace,
// 	ReplacementValue
// > = {
// 	[Key in keyof Obj]: Exclude<Obj[Key], ValueToReplace> | ReplacementValue;
// };
export type ReplaceValue<
	Obj extends Record<string, unknown>,
	ValueToReplace,
	ReplacementValue
> = {
	[Key in keyof Obj]: ValueToReplace extends Obj[Key]
		? ReplacementValue | Exclude<Obj[Key], ValueToReplace>
		: Obj[Key];
};

export type TypeGuardFromBlank<IsType> = (input: any) => input is IsType;

// A type guard where the input has a type, and the function
// merely narrows it down to a subset of that type
export type NarrowingTypeGuard<BaseType, SubType extends BaseType> = (
	input: BaseType
) => input is SubType;
