import {
	Action,
	actionSchema,
	FinalActions,
	PayloadAction,
	payloadActionSchema,
	staticResolvedActionSchemaFields,
} from "$actions";
import {
	filterableItemPropertySchema,
	fullSheetSchema,
	itemCreationSchema,
	sortableItemPropertySchema,
} from "$extra-schemas";
import { Item } from "@prisma/client";
import { characterSchema } from "@prisma/schemas";
import { z } from "zod";

/* #region  General Sheet Actions */
export const setSheetActionSchema = payloadActionSchema(
	"set-sheet",
	fullSheetSchema
);

export const setSheetNameActionSchema = payloadActionSchema(
	"set-sheet-name",
	z.string()
);

export const resolvedSetSheetNameActionSchema =
	staticResolvedActionSchemaFields.extend({
		type: setSheetNameActionSchema.shape.type,
		originalAction: setSheetNameActionSchema,
		resolvedPayload: z.object({
			sheetId: z.string(),
			newName: z.string(),
		}),
	});
/* #endregion */

/* #region  Character Actions  */

export const characterDeletionItemPassStrategySchema = z.object({
	type: z.literal("item-pass"),
	data: z.object({
		toCharacterId: z.string(),
	}),
});

export const characterDeletionItemDeleteStrategySchema = z.object({
	type: z.literal("item-delete"),
});

export const characterDeletionItemToNobodyStrategySchema = z.object({
	type: z.literal("item-to-nobody"),
});

export const characterDeletionStrategySchema = z.union([
	characterDeletionItemPassStrategySchema,
	characterDeletionItemDeleteStrategySchema,
	characterDeletionItemToNobodyStrategySchema,
]);

export const characterDeletionActionPayloadSchema = z.object({
	characterId: z.string(),
	strategy: characterDeletionStrategySchema,
});
export const characterDeletionActionSchema = payloadActionSchema(
	"remove-character",
	characterDeletionActionPayloadSchema
);

export const characterUpdateActionSchema = payloadActionSchema(
	"update-character",
	z.object({
		characterId: z.string(),
		data: characterSchema.pick({ name: true, carryCapacity: true }).partial(),
	})
);

export const characterCreationActionSchema = payloadActionSchema(
	"add-character",
	characterSchema.pick({ carryCapacity: true, name: true })
);

export const resolvedCharacterCreationActionSchema =
	staticResolvedActionSchemaFields.extend({
		type: characterCreationActionSchema.shape.type,
		originalAction: characterCreationActionSchema,
		resolvedPayload: characterSchema,
	});

/* #endregion */

export const updateItemActionSchema = payloadActionSchema(
	"update-item",
	z.object({
		itemId: z.string(),
		data: itemCreationSchema.partial(),
	})
);

export const deleteItemActionSchema = payloadActionSchema(
	"remove-item",
	z.object({
		itemId: z.string(),
	})
);
/* #endregion */

/* #region  UI Actions */
export const characterDialogHandleDeleteActionSchema = actionSchema(
	"ui.handle-character-delete-button"
);

export const closeCharacterDeleteConfirmDialogActionSchema = actionSchema(
	"ui.close-character-delete-confirm-dialog"
);

export const openCharacterEditDialogAction = payloadActionSchema(
	"ui.open-character-edit-dialog",
	z.object({
		characterId: z.string(),
	})
);

export const closeCharacterDialogActionSchema = actionSchema(
	"ui.close-character-dialog"
);

export const openNewCharacterDialogActionSchema = actionSchema(
	"ui.open-new-character-dialog"
);

export const openSheetNameDialogActionSchema = actionSchema(
	"ui.open-sheet-name-dialog"
);
export const closeSheetNameDialogActionSchema = actionSchema(
	"ui.close-sheet-name-dialog"
);

export const toggleFilterActionSchema = payloadActionSchema(
	"ui.toggle-filter",
	z.object({
		property: filterableItemPropertySchema,
		value: z.string().or(z.null()),
	})
);

export const invertPropertyFilterActionSchema = payloadActionSchema(
	"ui.invert-filter",
	filterableItemPropertySchema
);

export const clearPropertyFilterActionSchema = payloadActionSchema(
	"ui.clear-filter",
	filterableItemPropertySchema
);

export const resetPropertyFilterActionSchema = payloadActionSchema(
	"ui.reset-filter",
	filterableItemPropertySchema
);

export const toggleSortActionSchema = payloadActionSchema(
	"ui.toggle-sort",
	sortableItemPropertySchema
);

export const openFilterMenuActionSchema = payloadActionSchema(
	"ui.open-filter-menu",
	filterableItemPropertySchema
);
export const closeFilterMenuActionSchema = actionSchema("ui.close-filter-menu");

export const openNewItemDialogActionSchema = actionSchema(
	"ui.open-new-item-dialog"
);
export const openItemEditDialogActionSchema = payloadActionSchema(
	"ui.open-item-edit-dialog",
	z.string()
);
export const closeItemDialogActionSchema = actionSchema("ui.close-item-dialog");

/* #endregion */

export type InventoryStoreAction =
	| PayloadAction<"add-item", Omit<Item, "id">>
	| PayloadAction<"ui.set-search-value", string>
	| Action<"ui.open-filter-dialog">
	| Action<"ui.close-filter-dialog">
	| Action<"ui.reset-all-filters">
	| Action<"ui.open-welcome-dialog">
	| Action<"ui.close-welcome-dialog">
	| z.infer<typeof updateItemActionSchema>
	| z.infer<typeof deleteItemActionSchema>
	| z.infer<typeof setSheetActionSchema>
	| z.infer<typeof setSheetNameActionSchema>
	| z.infer<typeof characterCreationActionSchema>
	| z.infer<typeof characterDeletionActionSchema>
	| z.infer<typeof characterUpdateActionSchema>
	| z.infer<typeof openCharacterEditDialogAction>
	| z.infer<typeof closeCharacterDialogActionSchema>
	| z.infer<typeof openNewCharacterDialogActionSchema>
	| z.infer<typeof characterDialogHandleDeleteActionSchema>
	| z.infer<typeof closeCharacterDeleteConfirmDialogActionSchema>
	| z.infer<typeof openSheetNameDialogActionSchema>
	| z.infer<typeof closeSheetNameDialogActionSchema>
	| z.infer<typeof toggleFilterActionSchema>
	| z.infer<typeof invertPropertyFilterActionSchema>
	| z.infer<typeof clearPropertyFilterActionSchema>
	| z.infer<typeof resetPropertyFilterActionSchema>
	| z.infer<typeof toggleSortActionSchema>
	| z.infer<typeof openFilterMenuActionSchema>
	| z.infer<typeof closeFilterMenuActionSchema>
	| z.infer<typeof openNewItemDialogActionSchema>
	| z.infer<typeof openItemEditDialogActionSchema>
	| z.infer<typeof closeItemDialogActionSchema>;

export type ResolvedInventoryStoreAction =
	| z.infer<typeof resolvedSetSheetNameActionSchema>
	| z.infer<typeof resolvedCharacterCreationActionSchema>;

export type FinalInventoryStoreAction = FinalActions<
	InventoryStoreAction | ResolvedInventoryStoreAction
>;
