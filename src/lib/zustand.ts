import { UseBoundStore } from "zustand";

export * from "zustand/react";

export { default as createState } from "zustand/react";
export { combine as withSeparateActions } from "zustand/middleware";

export type Selector<Store extends UseBoundStore<any>, Derivation> = (
	p: ReturnType<Store>
) => Derivation;
