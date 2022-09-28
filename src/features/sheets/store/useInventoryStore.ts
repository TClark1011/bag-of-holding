import { PayloadAction, ResolvedActionFromUnresolved } from "$actions";
import { rejectItemWithId, updateItemWithId } from "$root/utils";
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
import { match } from "ts-pattern";
import { Except } from "type-fest";

type ClientItemCreationInput = Except<ItemCreationInput, "sheetId">;
type ClientCharacterCreationInput = Except<CharacterCreationInput, "sheetId">;

type InventoryStoreProps = {
	sheet: FullSheet;
	resolvedActionIds: string[];
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
};

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

type InventoryStoreRemoveCharacterAction = PayloadAction<
	"remove-character",
	{
		characterId: string;
		strategy: CharacterRemovalStrategy;
	}
>;
type ResolvedInventoryStoreRemoveCharacterAction = ResolvedActionFromUnresolved<
	InventoryStoreRemoveCharacterAction,
	InventoryStoreRemoveCharacterAction["payload"]
>;

type InventoryStoreAction = (
	| InventoryStoreAddItemAction
	| InventoryStoreUpdateItemAction
	| InventoryStoreRemoveItemAction
	| InventoryStoreSetSheetAction
	| InventoryStoreSetSheetNameAction
	| InventoryStoreCreateCharacterAction
	| InventoryStoreRemoveCharacterAction
) & {
	actionId?: string;
};

type ResolvedInventoryStoreAction =
	| ResolvedInventoryStoreAddItemAction
	| ResolvedInventoryStoreUpdateItemAction
	| ResolvedInventoryStoreRemoveItemAction
	| ResolvedInventoryStoreSetSheetAction
	| ResolvedInventoryStoreSetSheetNameAction
	| ResolvedInventoryStoreCreateCharacterAction
	| ResolvedInventoryStoreRemoveCharacterAction;

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
		.with({ type: "remove-item" }, F.identity)
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
		.with({ type: "set-sheet" }, F.identity)
		.with({ type: "set-sheet-name" }, F.identity)
		.with({ type: "remove-character" }, F.identity)
		.with({ type: "add-character" }, ({ payload }) => ({
			type: "add-character",
			payload: composeCharacter({ ...payload, sheetId: sheet.id }),
		}))
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
		const resolvedAction = resolveInventoryAction(
			draftState.sheet,
			action,
			action.actionId
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
			.exhaustive();

		// Mark that this action has been applied by pushing
		// its id to the list of resolved action ids
		draftState.resolvedActionIds.push(resolvedAction.actionId);
		useLastInventoryStoreAction.setState({
			lastAction: resolvedAction,
		});
	});

const useInventoryStore = createState(
	withReducer(inventoryStoreReducer, initialInventoryStoreState)
);

// eslint-disable-next-line jsdoc/require-jsdoc
export const useInventoryStoreDispatch = () =>
	useInventoryStore((s) => s.dispatch);

// eslint-disable-next-line jsdoc/require-jsdoc
export const useInventoryStoreState = () => useInventoryStore((s) => s.sheet);

export default useInventoryStore;
