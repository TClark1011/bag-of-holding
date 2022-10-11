import prisma from "$prisma";
import sheetRelatedProcedure from "$root/server/sheetRelatedProcedure";
import {
	characterDeletionActionSchema,
	characterUpdateActionSchema,
	resolvedCharacterCreationActionSchema,
} from "$sheets/store/inventoryActions";
import trpc from "$trpc";

const characterRouter = trpc.router({
	create: sheetRelatedProcedure
		.input(resolvedCharacterCreationActionSchema)
		.mutation(async ({ input }) => {
			const newCharacter = await prisma.character.create({
				data: input.resolvedPayload,
			});

			return newCharacter;
		}),
	delete: sheetRelatedProcedure
		.input(characterDeletionActionSchema)
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

			const deletedCharacter = await prisma.character.delete({
				where: {
					id: input.payload.characterId,
				},
			});

			return deletedCharacter;
		}),
	update: sheetRelatedProcedure
		.input(characterUpdateActionSchema)
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
