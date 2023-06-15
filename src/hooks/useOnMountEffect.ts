import { ReactEffect } from "$root/types";
import { useEffect } from "react";

/**
 * Run an effect when a component mounts and
 * never re-runs.
 * NOTE: This will not run when the component
 * mounts during server side rendering as next
 * does not execute `useEffect` calls during
 * SSR.
 *
 * @param effect The effect to run
 */
const useOnMountEffect = (effect: ReactEffect) => {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(effect, []);
};

export default useOnMountEffect;
