import { UseBoundStore } from "zustand";
import { useEffect } from "react";

export {
	combine as withSeparateActions,
	redux as withReducer,
	persist as withPersistence,
	devtools as withDevtools,
} from "zustand/middleware";
export * from "zustand";
export { default as createState } from "zustand";

export type Selector<Store extends UseBoundStore<any>, Derivation> = (
	p: ReturnType<Store>
) => Derivation;

/**
 * Run an effect whenever a store value changes. The effect
 * will only run when the store changes and not when the
 * component mounts
 *
 * @param useStore The store hook to subscribe too
 * @param callback The callback to run when the store changes.
 * Receives the new value as the first argument
 */
export const useStoreEffect = <T extends Record<string, any>>(
	useStore: UseBoundStore<T>,
	callback: (v: T) => void
) => {
	useEffect(() => {
		const unsubscribe = useStore.subscribe(callback);

		return unsubscribe;
	});
};
