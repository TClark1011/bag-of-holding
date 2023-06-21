import { atomWithHash } from "jotai-location";
import { PrimitiveAtom, useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { A, F, O, S, pipe } from "@mobily/ts-belt";

type HistoryBoundBooleanAtom<T> = PrimitiveAtom<T> & {
	shouldDisappearFromUrl: (v: T) => boolean;
};

const usedKeys = new Set<string>();

export const disappearingHashAtom = <T>(
	key: string,
	initialValue: T,
	shouldDisappearFromUrl: (v: T) => boolean
): HistoryBoundBooleanAtom<T> => {
	if (usedKeys.has(key)) {
		throw new Error(
			`There is already a disappearing hash atom using the key "${key}"`
		);
	}
	usedKeys.add(key);
	const atom = atomWithHash<T>(key, initialValue);
	return Object.assign(atom, { shouldDisappearFromUrl });
};

/**
 * A disappearing hash boolean atom is a hash atom that will
 * disappear from the URL when it is false, rather than showing
 * it as being false.
 *
 * NOTE: The behaviour of this is controlled by the
 * `useDisappearingHashBooleanAtom` hook, so you must always
 * use that when interfacing with this atom.
 */
export const uiIsOpenAtom = (key: string) =>
	disappearingHashAtom<boolean>(key, false, F.equals(false));

const getHashFromUrl = (url: string) =>
	pipe(
		url,
		S.split("#"),
		O.flatMap(A.last),
		O.map(S.prepend("#")),
		O.toUndefined
	);

export const useWipeHashFromUrl = () => {
	const router = useRouter();

	return useCallback(() => {
		const currentUrl = router.asPath;
		const currentUrlWithoutHash = currentUrl.replace(
			getHashFromUrl(currentUrl) ?? "",
			""
		);

		if (router.isReady) {
			router.replace(currentUrlWithoutHash);
		}
	}, [router]);
};

export const useSetDisappearingHashAtom = <T>(
	theAtom: ReturnType<typeof disappearingHashAtom<T>>
) => {
	const baseSetValue = useSetAtom(theAtom);
	const wipeHashFromUrl = useWipeHashFromUrl();

	const setValue = useCallback(
		(newValue: T) => {
			baseSetValue(newValue);

			if (theAtom.shouldDisappearFromUrl(newValue)) {
				wipeHashFromUrl();
			}
		},
		[baseSetValue, theAtom, wipeHashFromUrl]
	);

	return setValue;
};

export const useDisappearingHashAtom = <T>(
	theAtom: ReturnType<typeof disappearingHashAtom<T>>
) => {
	const value = useAtomValue(theAtom);
	const setValue = useSetDisappearingHashAtom(theAtom);

	return [value, setValue] as const;
};
