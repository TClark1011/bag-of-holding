import { UseDisclosureReturn } from "@chakra-ui/react";
import { B, F } from "@mobily/ts-belt";
import { Atom, PrimitiveAtom, useAtom, useAtomValue } from "jotai";
import { selectAtom } from "jotai/utils";
import { useMemo } from "react";

export const useAtomWithSelector = <AtomType, Selection>(
	theAtom: Atom<AtomType>,
	selector: (atomValue: AtomType) => Selection,
	deps: any[]
) => {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const memoisedSelector = useMemo(() => selector, deps);
	const theSelectorAtom = useMemo(
		() => selectAtom(theAtom, memoisedSelector),
		[theAtom, memoisedSelector]
	);

	return useAtomValue(theSelectorAtom);
};

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

export const useDisclosureAtom = (
	theAtom: PrimitiveAtom<boolean>
): Pick<UseDisclosureReturn, "isOpen" | "onClose" | "onToggle" | "onOpen"> => {
	const [isOpen, setIsOpen] = useAtom(theAtom);

	return {
		isOpen,
		onOpen: () => setIsOpen(true),
		onClose: () => setIsOpen(false),
		onToggle: () => setIsOpen(B.not),
	};
};
