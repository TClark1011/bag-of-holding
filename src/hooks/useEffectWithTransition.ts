import { useEffect, useTransition } from "react";

const useEffectWithTransition = (effect: () => void, deps: any[]) => {
	const [, startTransition] = useTransition();

	useEffect(() => {
		startTransition(() => {
			effect();
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);
};

export default useEffectWithTransition;
