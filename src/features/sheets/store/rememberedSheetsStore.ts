import { PayloadAction } from "$actions";
import { get } from "$fp";
import { Fn } from "$root/types";
import {
	StorageUnit,
	matchById,
	mustBeNever,
	rejectItemWithId,
	upsert,
} from "$root/utils";
import { matchesSchema } from "$zod-helpers";

import { A, flow } from "@mobily/ts-belt";
import getTime from "date-fns/getTime";
import produce from "immer";
import { getDefaultStore, useAtomValue, useSetAtom } from "jotai";
import { atomWithReducer, selectAtom } from "jotai/utils";
import { Reducer, useMemo } from "react";
import { z } from "zod";

const rememberedSheetSchema = z.object({
	name: z.string(),
	id: z.string(),
	visitedAt: z.date(),
});

export type RememberedSheet = z.infer<typeof rememberedSheetSchema>;

const baseRememberedSheetsStateSchema = z.object({
	rememberedSheets: z.array(rememberedSheetSchema),
});

const legacyZustandStateSchema = z.object({
	state: baseRememberedSheetsStateSchema,
});

const isOldLegacyState = matchesSchema(legacyZustandStateSchema);

const rememberedSheetsStateSchema = z.preprocess((val) => {
	// We fix any old legacy state
	if (isOldLegacyState(val)) {
		return val.state;
	}

	return val;
}, baseRememberedSheetsStateSchema);

export type RememberedSheetsState = z.infer<
	typeof baseRememberedSheetsStateSchema
>;

export type RememberedSheetAction =
	| PayloadAction<"remember-sheet", RememberedSheet>
	| PayloadAction<"remove-sheet", { sheetId: string }>;

const rememberedSheetsInitialState: RememberedSheetsState = {
	rememberedSheets: [],
};

const rememberedSheetsReducer: Reducer<
	RememberedSheetsState,
	RememberedSheetAction
> = produce((draftState, action) => {
	switch (action.type) {
		case "remember-sheet": {
			draftState.rememberedSheets = upsert(
				draftState.rememberedSheets,
				action.payload,
				matchById
			);
			break;
		}
		case "remove-sheet": {
			draftState.rememberedSheets = rejectItemWithId(
				draftState.rememberedSheets,
				action.payload.sheetId
			);
			break;
		}
		default: {
			mustBeNever(action);
		}
	}
});

const rememberedSheetsStorageController = new StorageUnit(
	"remembered-sheets",
	rememberedSheetsInitialState,
	rememberedSheetsStateSchema
);

const store = getDefaultStore();

const rememberedSheetsAtom = atomWithReducer(
	rememberedSheetsStorageController.getValue(),
	rememberedSheetsReducer
);

store.sub(rememberedSheetsAtom, () => {
	const newVal = store.get(rememberedSheetsAtom);
	rememberedSheetsStorageController.setValue(newVal);
});

const sortRememberedSheetsByVisitedAt: Fn<
	[RememberedSheet[]],
	RememberedSheet[]
> = flow(A.sortBy(flow(get("visitedAt"), getTime)), A.reverse);

const selectRememberedSheets: Fn<[RememberedSheetsState], RememberedSheet[]> =
	flow(get("rememberedSheets"), sortRememberedSheetsByVisitedAt, A.take(4));

export function useRememberedSheetsStore(): RememberedSheetsState;
export function useRememberedSheetsStore<T>(
	select: (state: RememberedSheetsState) => T,
	deps: any[]
): T;
export function useRememberedSheetsStore<T>(
	...args: [] | [(state: RememberedSheetsState) => T, any[]?]
): RememberedSheetsState | T {
	const [selector, deps = []] = args;

	// Required otherwise the selector will be re-created on every render
	const memoisedSelector = useMemo(() => selector, deps);

	const selectorAtom = useMemo(
		() =>
			memoisedSelector === undefined
				? rememberedSheetsAtom
				: selectAtom(rememberedSheetsAtom, memoisedSelector),
		[memoisedSelector]
	);

	const value = useAtomValue(selectorAtom);

	return value;
}

export const useRememberedSheets = () =>
	useRememberedSheetsStore(selectRememberedSheets, []);
export const useRememberedSheetsDispatch = () =>
	useSetAtom(rememberedSheetsAtom);
