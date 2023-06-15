import { get } from "$fp";
import { ImmerReducer, createReducerFunction } from "$immer-reducer";
import { createSelectorHookForAtom } from "$jotai-helpers";

import { Fn } from "$root/types";
import { StorageUnit, matchById, rejectItemWithId, upsert } from "$root/utils";
import { matchesSchema } from "$zod-helpers";

import { A, flow } from "@mobily/ts-belt";
import getTime from "date-fns/getTime";
import { getDefaultStore, useSetAtom } from "jotai";
import { atomWithReducer } from "jotai/utils";
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

const rememberedSheetsInitialState: RememberedSheetsState = {
	rememberedSheets: [],
};

class RememberedSheetReducerClass extends ImmerReducer<RememberedSheetsState> {
	rememberSheet(rememberedSheet: RememberedSheet) {
		this.draftState.rememberedSheets = upsert(
			this.draftState.rememberedSheets,
			rememberedSheet,
			matchById
		);
	}

	removeSheet(sheetId: string) {
		this.draftState.rememberedSheets = rejectItemWithId(
			this.draftState.rememberedSheets,
			sheetId
		);
	}
}

const rememberedSheetsReducer = createReducerFunction(
	RememberedSheetReducerClass
);

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

export const useRememberedSheetsStore =
	createSelectorHookForAtom(rememberedSheetsAtom);

export const useRememberedSheets = () =>
	useRememberedSheetsStore(selectRememberedSheets, []);
export const useRememberedSheetsDispatch = () =>
	useSetAtom(rememberedSheetsAtom);
