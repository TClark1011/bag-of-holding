import { atomWithHash } from "jotai-location";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

type HistoryBoundBooleanAtom = ReturnType<typeof atomWithHash<boolean>>;

const keyToAtomMap = new Map<HistoryBoundBooleanAtom, string>();

/**
 * A disappearing hash boolean atom is a hash atom that will
 * disappear from the URL when it is false, rather than showing
 * it as being false.
 *
 * NOTE: The behaviour of this is controlled by the
 * `useDisappearingHashBooleanAtom` hook, so you must always
 * use that when interfacing with this atom.
 */
export const disappearingHashBooleanAtom = (
	key: string
): HistoryBoundBooleanAtom => {
	const atom = atomWithHash<boolean>(key, false);
	keyToAtomMap.set(atom, key);
	return atom;
};

export const useDisappearingHashBooleanAtom = (
	theAtom: HistoryBoundBooleanAtom
) => {
	const router = useRouter();
	const [isOn, baseSetIsOn] = useAtom(theAtom);

	const previousUrlRef = useRef<string | undefined>(undefined);

	useEffect(() => {
		previousUrlRef.current = router.asPath;
	}, [router]);

	const revertStateToEmpty = () => {
		/**
		 * When we set the value to off, we don't want the "on"
		 * state to be left in the history stack, so we actually
		 * trigger a "back" event to remove the "on" state from
		 * the history stack. If the previous history state is
		 * not the same as the current one except for the hash,
		 * then we manually replace the current history state
		 * with one that has the hash removed.
		 */
		const keyForAtom = keyToAtomMap.get(theAtom);

		if (!keyForAtom) {
			throw new Error("Could not find key for atom. This should never happen.");
		}
		const currentUrl = router.asPath;
		const currentUrlWithoutHash = currentUrl
			.replace(`#${keyForAtom}=true`, "")
			.replace(`#${keyForAtom}=false`, "");
		// I know this *should* be done with a regex instead but I'm lazy rn

		if (currentUrlWithoutHash === previousUrlRef.current) {
			router.back();
		} else {
			router.push(currentUrlWithoutHash);
		}
	};

	const setIsOn = (willBeOn: boolean) => {
		if (isOn === willBeOn) return;

		if (isOn && !willBeOn) {
			revertStateToEmpty();
		} else {
			baseSetIsOn(true);
		}
	};

	const toggle = () => setIsOn(!isOn);

	return {
		toggle: toggle,
		isOn,
		set: setIsOn,
	};
};
