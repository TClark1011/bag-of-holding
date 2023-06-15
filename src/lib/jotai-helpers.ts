import { F } from "@mobily/ts-belt";
import { Atom, useAtomValue } from "jotai";
import { selectAtom } from "jotai/utils";
import { useMemo } from "react";

export const useAtomWithSelector = <AtomType, Selection>(
	theAtom: Atom<AtomType>,
	selector: (atomValue: AtomType) => Selection,
	deps: any[]
) => {
	const memoisedSelector = useMemo(() => selector, deps);
	const theSelectorAtom = useMemo(
		() => selectAtom(theAtom, memoisedSelector),
		[theAtom, memoisedSelector]
	);

	return useAtomValue(theSelectorAtom);
};

// export const createSelectorHookForAtom =
// 	<AtomType>(theAtom: Atom<AtomType>) =>
// 	<Selection>(selector: (atomValue: AtomType) => Selection, deps: any[]) =>
// 		useAtomWithSelector(theAtom, selector, deps);
export const createSelectorHookForAtom = <AtomType>(
	theAtom: Atom<AtomType>
) => {
	function useTheAtom<Selection>(
		selector: (atomValue: AtomType) => Selection,
		deps: any[]
	): Selection;
	function useTheAtom(): AtomType;
	function useTheAtom<Selection>(
		...args: [] | [(atomValue: AtomType) => Selection, any[]]
	) {
		const [selector = F.identity, deps = []] = args;

		return useAtomWithSelector(theAtom, selector, deps);
	}

	return useTheAtom;
};
