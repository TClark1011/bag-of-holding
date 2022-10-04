import { asResolvedActionSchema } from "$actions";
import prisma from "$prisma";
import {
	resolvedCharacterDeletionActionSchema,
	resolvedCharacterUpdateActionSchema,
} from "$sheets/store/inventoryActions";
import trpc from "$trpc";
import { characterSchema } from "prisma/schemas/character";
import { z } from "zod";

const characterRouter = trpc.router({
	create: trpc.procedure
		.input(asResolvedActionSchema(characterSchema))
		.mutation(async ({ input }) => {
			const newCharacter = await prisma.character.create({
				data: input.payload,
			});

			return newCharacter;
		}),
	delete: trpc.procedure
		.input(resolvedCharacterDeletionActionSchema)
		.mutation(async ({ input }) => {
			switch (input.payload.strategy.type) {
				case "item-to-nobody":
					await prisma.item.updateMany({
						where: {
							carriedByCharacterId: input.payload.characterId,
						},
						data: {
							carriedByCharacterId: null,
						},
					});
					break;
				case "item-pass":
					await prisma.item.updateMany({
						where: {
							carriedByCharacterId: input.payload.characterId,
						},
						data: {
							carriedByCharacterId: input.payload.strategy.data.toCharacterId,
						},
					});
					break;
			}

			await prisma.character.delete({
				where: {
					id: input.payload.characterId,
				},
			});
		}),
	update: trpc.procedure
		.input(resolvedCharacterUpdateActionSchema)
		.mutation(async ({ input }) => {
			const updatedCharacter = await prisma.character.update({
				where: {
					id: input.payload.characterId,
				},
				data: input.payload.data,
			});

			return updatedCharacter;
		}),
});

export default characterRouter;
