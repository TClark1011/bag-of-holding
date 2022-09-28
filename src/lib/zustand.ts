import { UseBoundStore } from "zustand";

export {
	combine as withSeparateActions,
	redux as withReducer,
} from "zustand/middleware";
export * from "zustand";
export { default as createState } from "zustand";

export type Selector<Store extends UseBoundStore<any>, Derivation> = (
	p: ReturnType<Store>
) => Derivation;
