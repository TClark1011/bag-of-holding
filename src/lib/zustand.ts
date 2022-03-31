import { UseBoundStore } from "zustand";

export { combine as withSeparateActions } from "zustand/middleware";
export * from "zustand";
export { default as createState } from "zustand";

export type Selector<Store extends UseBoundStore<any>, Derivation> = (
	p: ReturnType<Store>
) => Derivation;
