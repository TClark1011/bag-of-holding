import { z } from "zod";

export const characterRemovalItemPassStrategySchema = z.object({
	type: z.literal("item-pass"),
	data: z.object({
		toCharacterId: z.string(),
	}),
});

export type CharacterRemovalItemPassStrategy = z.infer<
	typeof characterRemovalItemPassStrategySchema
>;

export const characterRemovalItemDeleteStrategySchema = z.object({
	type: z.literal("item-delete"),
});
export type CharacterRemovalItemDeleteStrategy = z.infer<
	typeof characterRemovalItemDeleteStrategySchema
>;

export const characterRemovalItemToNobodyStrategySchema = z.object({
	type: z.literal("item-to-nobody"),
});
export type CharacterRemovalItemToNobodyStrategy = z.infer<
	typeof characterRemovalItemToNobodyStrategySchema
>;

export const characterRemovalStrategySchema = z.union([
	characterRemovalItemPassStrategySchema,
	characterRemovalItemDeleteStrategySchema,
	characterRemovalItemToNobodyStrategySchema,
]);
export type CharacterRemovalStrategy = z.infer<
	typeof characterRemovalStrategySchema
>;
