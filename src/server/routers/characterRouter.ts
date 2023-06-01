import prisma from "$prisma";
import sheetRelatedProcedure from "$root/server/sheetRelatedProcedure";
import { characterDeletionActionPayloadSchema } from "$sheets/store/inventoryActions";
import trpc from "$trpc";
import { characterSchema } from "prisma/schemas/character";
import { z } from "zod";

const characterRouter = trpc.router({
	create: sheetRelatedProcedure
		.input(characterSchema.omit({ id: true }))
		.mutation(async ({ input }) => {
			const newCharacter = await prisma.character.create({
				data: input,
			});

			return newCharacter;
		}),
	delete: sheetRelatedProcedure
		.input(characterDeletionActionPayloadSchema)
		.mutation(async ({ input }) => {
			switch (input.strategy.type) {
				case "item-to-nobody":
					await prisma.item.updateMany({
						where: {
							carriedByCharacterId: input.characterId,
						},
						data: {
							carriedByCharacterId: null,
						},
					});
					break;
				case "item-pass":
					await prisma.item.updateMany({
						where: {
							carriedByCharacterId: input.characterId,
						},
						data: {
							carriedByCharacterId: input.strategy.data.toCharacterId,
						},
					});
					break;
				case "item-delete":
					await prisma.item.deleteMany({
						where: {
							carriedByCharacterId: input.characterId,
						},
					});
					break;
			}

			const deletedCharacter = await prisma.character.delete({
				where: {
					id: input.characterId,
				},
			});

			return deletedCharacter;
		}),
	update: sheetRelatedProcedure
		.input(
			z.object({
				characterId: z.string(),
				data: characterSchema.partial(),
			})
		)
		.mutation(async ({ input }) => {
			const updatedCharacter = await prisma.character.update({
				where: {
					id: input.characterId,
				},
				data: input.data,
			});

			return updatedCharacter;
		}),
});

export default characterRouter;
