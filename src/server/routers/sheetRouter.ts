import prisma from "$prisma";
import trpc from "$trpc";
import { D } from "@mobily/ts-belt";
import { z } from "zod";

const moneyUpdateResultSchema = z.object({
	newPartyMoney: z.number().min(0).optional(),
	newCharacterMoney: z.record(z.number().min(0)).optional(),
});

const sheetRouter = trpc.router({
	getFull: trpc.procedure.input(z.string()).query(({ input }) =>
		prisma.sheet.findUnique({
			where: {
				id: input,
			},
			include: {
				characters: true,
				items: true,
			},
		})
	),
	setName: trpc.procedure
		.input(
			z.object({
				sheetId: z.string(),
				newName: z.string(),
			})
		)
		.mutation(({ input }) =>
			prisma.sheet.update({
				where: {
					id: input.sheetId,
				},
				data: {
					name: input.newName,
				},
			})
		),
	create: trpc.procedure.mutation(() =>
		prisma.sheet.create({
			data: {
				name: "New Sheet",
			},
		})
	),
	updateMoney: trpc.procedure
		.input(
			z.object({
				sheetData: z
					.object({
						sheetId: z.string(),
						partyMoney: z.number().min(0),
					})
					.optional(),
				characterIdsToMoney: z.record(z.number().min(0)).default({}),
			})
		)
		.output(moneyUpdateResultSchema)
		.mutation(async ({ input }) => {
			const result: z.infer<typeof moneyUpdateResultSchema> = {};

			if (input.sheetData) {
				const sheetUpdateResult = await prisma.sheet.update({
					where: {
						id: input.sheetData.sheetId,
					},
					data: {
						partyMoney: input.sheetData.partyMoney,
					},
				});

				result.newPartyMoney = sheetUpdateResult.partyMoney;
			}

			if (D.isEmpty(input.characterIdsToMoney)) return result;

			const updatedCharacters = await Promise.all(
				D.toPairs(input.characterIdsToMoney).map(([characterId, newMoney]) =>
					prisma.character.update({
						where: {
							id: characterId,
						},
						data: {
							money: newMoney,
						},
					})
				)
			);

			result.newCharacterMoney = {};

			updatedCharacters.forEach((character) => {
				(result.newCharacterMoney ?? {})[character.id] = character.money;
			});

			return result;
		}),
});

export default sheetRouter;
