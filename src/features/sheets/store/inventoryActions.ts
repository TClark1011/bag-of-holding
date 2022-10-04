import {
	actionSchema,
	payloadActionSchema,
	withActionIdSchema,
} from "$actions";
import { characterSchema } from "@prisma/schemas";
import { z } from "zod";

/* #region CHARACTER DELETION  */
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

export const characterDeletionActionSchema = payloadActionSchema(
	"remove-character",
	z.object({
		characterId: z.string(),
		strategy: characterDeletionStrategySchema,
	})
);

export const resolvedCharacterDeletionActionSchema = characterDeletionActionSchema.and(
	withActionIdSchema
);
/* #endregion */

/* #region  CHARACTER UPDATE */

export const characterUpdateActionSchema = payloadActionSchema(
	"update-character",
	z.object({
		characterId: z.string(),
		data: characterSchema.pick({ name: true, carryCapacity: true }).partial(),
	})
);

export const resolvedCharacterUpdateActionSchema = characterUpdateActionSchema.and(
	withActionIdSchema
);

/* #endregion */

export const characterDialogHandleDeleteActionSchema = actionSchema(
	"ui.handle-character-delete-button"
);

export const resolvedCharacterDialogHandleDeleteActionSchema = characterDialogHandleDeleteActionSchema
	.extend({
		payload: z.null(),
	})
	.and(withActionIdSchema);
