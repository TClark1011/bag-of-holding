import { DependencyList, useEffect } from "react";

/**
 * A use effect call that is debounced
 *
 * @param callback The effect to execute. NOTE: This cannot return
 * a cleanup function
 * @param dependencies The dependencies of the effect
 * @param delay The delay to apply to the debounce
 */
export const useDebouncedEffect = (
	callback: () => void,
	dependencies: DependencyList,
	delay: number
) => {
	useEffect(() => {
		const handler = setTimeout(() => callback(), delay);

		return () => clearTimeout(handler);
	}, [...dependencies, delay]);
};
