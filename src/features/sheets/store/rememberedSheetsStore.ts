import { PayloadAction } from "$actions";
import { get } from "$fp";
import { Fn } from "$root/types";
import { matchById, mustBeNever, rejectItemWithId, upsert } from "$root/utils";
import {
	createState,
	withDevtools,
	withPersistence,
	withReducer,
} from "$zustand";
import { A, flow, pipe } from "@mobily/ts-belt";
import getTime from "date-fns/getTime";
import produce from "immer";
import { Reducer } from "react";
import SuperJSON from "superjson";

export type RememberedSheet = {
	name: string;
	id: string;
	visitedAt: Date;
};

export type RememberedSheetsState = {
	rememberedSheets: RememberedSheet[];
};

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

const useRememberedSheetsStore = pipe(
	withReducer(rememberedSheetsReducer, rememberedSheetsInitialState),
	(store) =>
		withPersistence(store, {
			name: "remembered-sheets",
			serialize: SuperJSON.stringify,
			deserialize: SuperJSON.parse,
		}),
	(store) =>
		withDevtools(store, {
			name: "remembered-sheets",
		}),
	(store) => createState(store)
);

const sortRememberedSheetsByVisitedAt: Fn<
	[RememberedSheet[]],
	RememberedSheet[]
> = flow(A.sortBy(flow(get("visitedAt"), getTime)), A.reverse);

const selectRememberedSheets: Fn<[RememberedSheetsState], RememberedSheet[]> =
	flow(get("rememberedSheets"), sortRememberedSheetsByVisitedAt, A.take(4));

export const useRememberedSheets = () =>
	useRememberedSheetsStore(selectRememberedSheets);
export const useRememberedSheetsDispatch = () =>
	useRememberedSheetsStore((s) => s.dispatch);
