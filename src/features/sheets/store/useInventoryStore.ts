import {
	Action,
	PayloadAction,
	ResolvedActionFromUnresolved,
	SimpleResolvedActionFromUnresolvedWithPayload,
	withActionIdSchema,
} from "$actions";
import { hasId, rejectItemWithId, updateItemWithId } from "$root/utils";
import { CharacterRemovalStrategy, FullSheet } from "$sheets/types";
import { itemIsCarriedByCharacterId } from "$sheets/utils";
import {
	CharacterCreationInput,
	composeCharacter,
	composeItem,
	ItemCreationInput,
} from "$sheets/utils/sheetEntityComposers";
import { createState, withReducer } from "$zustand";
import { A, D, F } from "@mobily/ts-belt";
import { Character, Item } from "@prisma/client";
import cuid from "cuid";
import produce from "immer";
import { Reducer } from "react";
import { match, P } from "ts-pattern";
import { Except } from "type-fest";
import { devtools } from "zustand/middleware";
import {
	characterDeletionActionSchema,
	characterUpdateActionSchema,
	characterDialogHandleDeleteActionSchema,
	resolvedCharacterDeletionActionSchema,
	resolvedCharacterUpdateActionSchema,
	resolvedCharacterDialogHandleDeleteActionSchema,
} from "$sheets/store/inventoryActions";
import { z } from "zod";
import { matchesSchema } from "$zodHelpers";

type ClientItemCreationInput = Except<ItemCreationInput, "sheetId">;
type ClientCharacterCreationInput = Except<CharacterCreationInput, "sheetId">;

type CharacterDialogStateProps =
	| {
			mode: "closed";
	  }
	| {
			mode: "edit";
			data: {
				characterId: string;
				subMode: "delete" | "plain";
			};
	  }
	| {
			mode: "new-character";
	  };

type InventoryStoreProps = {
	sheet: FullSheet;
	resolvedActionIds: string[];
	ui: {
		characterDialog: CharacterDialogStateProps;
	};
};

const initialInventoryStoreState: InventoryStoreProps = {
	sheet: {
		characters: [],
		id: "",
		items: [],
		name: "",
		updatedAt: new Date(),
	},
	resolvedActionIds: [],
	ui: {
		characterDialog: {
			mode: "closed",
		},
	},
};

/* ---------------------------------- */
/*              Selectors             */
/* ---------------------------------- */

/**
 * @param selector
 */
export const fromSheet = <Selection>(selector: (p: FullSheet) => Selection) => (
	state: InventoryStoreProps
) => selector(state.sheet);

type InventoryStoreSelector<Selection> = (
	state: InventoryStoreProps
) => Selection;

/**
 * @param s
 */
export const selectCharacterDialogMode: InventoryStoreSelector<
	CharacterDialogStateProps["mode"]
> = (s) => s.ui.characterDialog.mode;

/**
 * @param s
 */
export const selectCharacterBeingEdited: InventoryStoreSelector<Character | null> = (
	s
) => {
	const idOfCharacterBeingEdited = match(s.ui.characterDialog)
		.with({ mode: "edit" }, ({ data }) => data.characterId)
		.otherwise(() => null);

	if (!idOfCharacterBeingEdited) return null;

	return s.sheet.characters.find(hasId(idOfCharacterBeingEdited)) ?? null;
};

/**
 * @param characterId
 */
export const selectCharacterCarriedItems = (
	characterId: string
): InventoryStoreSelector<Item[]> =>
	fromSheet((sheet) =>
		sheet.items.filter((item) => item.carriedByCharacterId === characterId)
	);

/* ---------------------------------- */
/*               Actions              */
/* ---------------------------------- */

type InventoryStoreAddItemAction = {
	type: "add-item";
	payload: ClientItemCreationInput;
};
type ResolvedInventoryStoreAddItemAction = ResolvedActionFromUnresolved<
	InventoryStoreAddItemAction,
	Item
>;

type InventoryStoreUpdateItemAction = PayloadAction<
	"update-item",
	{
		itemId: string;
		updateData: Partial<ClientItemCreationInput>;
	}
>;
type ResolvedInventoryStoreUpdateItemAction = ResolvedActionFromUnresolved<
	InventoryStoreUpdateItemAction,
	{
		itemId: string;
		updateData: Except<
			Partial<ItemCreationInput> & Pick<ItemCreationInput, "sheetId">,
			"id"
		>;
	}
>;

type InventoryStoreRemoveItemAction = PayloadAction<
	"remove-item",
	{
		itemId: string;
	}
>;
type ResolvedInventoryStoreRemoveItemAction = ResolvedActionFromUnresolved<
	InventoryStoreRemoveItemAction,
	InventoryStoreRemoveItemAction["payload"]
>;

type InventoryStoreSetSheetAction = PayloadAction<"set-sheet", FullSheet>;
type ResolvedInventoryStoreSetSheetAction = ResolvedActionFromUnresolved<
	InventoryStoreSetSheetAction,
	FullSheet
>;

type InventoryStoreSetSheetNameAction = PayloadAction<"set-sheet-name", string>;
type ResolvedInventoryStoreSetSheetNameAction = ResolvedActionFromUnresolved<
	InventoryStoreSetSheetNameAction,
	InventoryStoreSetSheetNameAction["payload"]
>;

type InventoryStoreCreateCharacterAction = PayloadAction<
	"add-character",
	ClientCharacterCreationInput
>;
type ResolvedInventoryStoreCreateCharacterAction = ResolvedActionFromUnresolved<
	InventoryStoreCreateCharacterAction,
	Character
>;

type InventoryStoreOpenCharacterEditDialogAction = PayloadAction<
	"ui.open-character-edit-dialog",
	{
		characterId: string;
	}
>;
type ResolvedInventoryStoreOpenCharacterEditDialogAction = SimpleResolvedActionFromUnresolvedWithPayload<InventoryStoreOpenCharacterEditDialogAction>;

type InventoryStoreCloseCharacterDialogAction = Action<"ui.close-character-dialog">;
type ResolvedInventoryStoreCloseCharacterDialogAction = ResolvedActionFromUnresolved<
	InventoryStoreCloseCharacterDialogAction,
	null
>;

type InventoryStoreOpenNewCharacterDialogAction = Action<"ui.open-new-character-dialog">;
type ResolvedInventoryStoreOpenNewCharacterDialogAction = ResolvedActionFromUnresolved<
	InventoryStoreOpenNewCharacterDialogAction,
	null
>;

export type InventoryStoreAction =
	| InventoryStoreAddItemAction
	| InventoryStoreUpdateItemAction
	| InventoryStoreRemoveItemAction
	| InventoryStoreSetSheetAction
	| InventoryStoreSetSheetNameAction
	| InventoryStoreCreateCharacterAction
	| z.infer<typeof characterDeletionActionSchema>
	| z.infer<typeof characterUpdateActionSchema>
	| InventoryStoreOpenCharacterEditDialogAction
	| InventoryStoreCloseCharacterDialogAction
	| InventoryStoreOpenNewCharacterDialogAction
	| z.infer<typeof characterDialogHandleDeleteActionSchema>;

export type ResolvedInventoryStoreAction =
	| ResolvedInventoryStoreAddItemAction
	| ResolvedInventoryStoreUpdateItemAction
	| ResolvedInventoryStoreRemoveItemAction
	| ResolvedInventoryStoreSetSheetAction
	| ResolvedInventoryStoreSetSheetNameAction
	| ResolvedInventoryStoreCreateCharacterAction
	| z.infer<typeof resolvedCharacterDeletionActionSchema>
	| z.infer<typeof resolvedCharacterUpdateActionSchema>
	| ResolvedInventoryStoreOpenCharacterEditDialogAction
	| ResolvedInventoryStoreCloseCharacterDialogAction
	| ResolvedInventoryStoreOpenNewCharacterDialogAction
	| z.infer<typeof resolvedCharacterDialogHandleDeleteActionSchema>;

export const useLastInventoryStoreAction = createState(() => ({
	lastAction: null as ResolvedInventoryStoreAction | null,
}));

const handleCharacterRemoval = (
	sheet: FullSheet,
	characterId: string,
	strategy: CharacterRemovalStrategy
) =>
	produce(sheet, (draftSheet) => {
		draftSheet.characters = rejectItemWithId<Character>(characterId)(
			sheet.characters
		);
		match(strategy)
			.with({ type: "item-delete" }, () => {
				draftSheet.items = A.reject(
					draftSheet.items,
					itemIsCarriedByCharacterId(characterId)
				);
			})
			.with({ type: "item-to-nobody" }, () => {
				draftSheet.items = A.map(
					draftSheet.items,
					F.when(
						itemIsCarriedByCharacterId(characterId),
						D.set("carriedByCharacterId", null)
					)
				);
			})
			.with({ type: "item-pass" }, ({ data }) => {
				draftSheet.items = A.map(
					draftSheet.items,
					F.when(
						itemIsCarriedByCharacterId(characterId),
						D.set("carriedByCharacterId", data.toCharacterId)
					)
				);
			})
			.exhaustive();
	});

const resolveInventoryAction = (
	sheet: FullSheet,
	action: InventoryStoreAction,
	actionId = cuid()
): ResolvedInventoryStoreAction => {
	const withoutActionId = match<
		typeof action,
		Except<ResolvedInventoryStoreAction, "actionId">
	>(action)
		.with({ type: "add-item" }, ({ payload }) => ({
			type: "add-item",
			payload: composeItem({ ...payload, sheetId: sheet.id }),
		}))
		.with({ type: "update-item" }, ({ payload }) => ({
			type: "update-item",
			payload: {
				itemId: payload.itemId,
				updateData: {
					...payload.updateData,
					sheetId: sheet.id,
				},
			},
		}))
		.with({ type: "add-character" }, ({ payload }) => ({
			type: "add-character",
			payload: composeCharacter({ ...payload, sheetId: sheet.id }),
		}))
		.with(
			// This handles all actions that do not have a payload in their
			// unresolved form
			{
				type: P.union(
					"ui.close-character-dialog",
					"ui.open-new-character-dialog",
					"ui.handle-character-delete-button"
				),
			},
			(action) => ({
				...action,
				payload: null,
			})
		)
		.with(
			{
				type: P.union(
					"set-sheet",
					"set-sheet-name",
					"remove-character",
					"remove-item",
					"ui.open-character-edit-dialog",
					"update-character"
				),
			},
			F.identity
		)
		.exhaustive();
	return {
		...withoutActionId,
		actionId,
	};
};

const inventoryStoreReducer: Reducer<
	InventoryStoreProps,
	InventoryStoreAction
> = (prevState, action) =>
	produce(prevState, (draftState) => {
		const actionId = matchesSchema(withActionIdSchema, action)
			? action.actionId
			: undefined;

		const resolvedAction = resolveInventoryAction(
			draftState.sheet,
			action,
			actionId
		);

		// If this action has already been applied, do not continue
		if (draftState.resolvedActionIds.includes(resolvedAction.actionId)) return;

		match(resolvedAction)
			.with({ type: "add-item" }, ({ payload }) => {
				draftState.sheet.items.push(payload);
			})
			.with({ type: "remove-item" }, ({ payload }) => {
				draftState.sheet.items = rejectItemWithId<Item>(payload.itemId)(
					draftState.sheet.items
				);
			})
			.with({ type: "update-item" }, ({ payload }) => {
				draftState.sheet.items = updateItemWithId<Item>(
					payload.itemId,
					D.merge(payload.updateData)
				)(draftState.sheet.items);
			})
			.with({ type: "remove-character" }, ({ payload }) => {
				draftState.sheet = handleCharacterRemoval(
					draftState.sheet,
					payload.characterId,
					payload.strategy
				);
			})
			.with({ type: "add-character" }, ({ payload }) => {
				draftState.sheet.characters.push(payload);
			})
			.with(
				{
					type: "set-sheet",
				},
				({ payload }) => {
					draftState.sheet = payload;
				}
			)
			.with({ type: "set-sheet-name" }, ({ payload }) => {
				draftState.sheet.name = payload;
			})
			.with({ type: "ui.open-character-edit-dialog" }, ({ payload }) => {
				draftState.ui.characterDialog = {
					mode: "edit",
					data: {
						characterId: payload.characterId,
						subMode: "plain",
					},
				};
			})
			.with({ type: "ui.close-character-dialog" }, () => {
				draftState.ui.characterDialog = {
					mode: "closed",
				};
			})
			.with({ type: "ui.open-new-character-dialog" }, () => {
				draftState.ui.characterDialog = {
					mode: "new-character",
				};
			})
			.with({ type: "ui.handle-character-delete-button" }, () => {
				alert("Handling character delete button");
				const characterBeingEdited = selectCharacterBeingEdited(draftState);
				const itemsCarriedByCharacterBeingEdited = selectCharacterCarriedItems(
					selectCharacterBeingEdited(draftState)?.id ?? ""
				)(draftState);
				if (draftState.ui.characterDialog.mode === "edit") {
					if (itemsCarriedByCharacterBeingEdited.length > 0) {
						draftState.ui.characterDialog.data.subMode = "delete";
						alert("Character Has Items");
					} else {
						// If character was not carrying any items, we can just remove them
						draftState = inventoryStoreReducer(draftState, {
							type: "remove-character",
							payload: {
								characterId: characterBeingEdited?.id ?? "",
								strategy: {
									type: "item-to-nobody",
								},
							},
						});
					}
				}
			})
			.with({ type: "update-character" }, ({ payload }) => {
				draftState.sheet.characters = updateItemWithId<Character>(
					payload.characterId,
					D.merge(payload.data)
				)(draftState.sheet.characters);
			})
			.exhaustive();

		// Mark that this action has been applied by pushing
		// its id to the list of resolved action ids
		draftState.resolvedActionIds.push(resolvedAction.actionId);
		useLastInventoryStoreAction.setState({
			lastAction: resolvedAction,
		});
	});

const useInventoryStore = createState(
	devtools(withReducer(inventoryStoreReducer, initialInventoryStoreState), {
		name: "inventory",
	})
);

// eslint-disable-next-line jsdoc/require-jsdoc
export const useInventoryStoreDispatch = () =>
	useInventoryStore((s) => s.dispatch);

// eslint-disable-next-line jsdoc/require-jsdoc
export const useInventoryStoreState = () => useInventoryStore((s) => s.sheet);

export default useInventoryStore;
