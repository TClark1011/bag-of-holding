import prisma from "$prisma";
import sheetRelatedProcedure from "$root/server/sheetRelatedProcedure";
import trpc from "$trpc";
import { itemSchema } from "prisma/schemas/item";
import { z } from "zod";

const itemRouter = trpc.router({
	create: sheetRelatedProcedure
		.input(itemSchema.omit({ id: true }))
		.mutation(async ({ input }) => {
			const item = await prisma.item.create({
				data: input,
			});

			return item;
		}),
	update: sheetRelatedProcedure
		.input(
			z.object({
				itemId: z.string(),
				data: itemSchema.omit({ id: true }).partial(),
			})
		)
		.mutation(async ({ input }) => {
			const item = await prisma.item.update({
				where: {
					id: input.itemId,
				},
				data: input.data,
			});

			return item;
		}),
	delete: sheetRelatedProcedure
		.input(
			z.object({
				itemId: z.string(),
			})
		)
		.mutation(async ({ input }) => {
			const result = await prisma.item.delete({
				where: {
					id: input.itemId,
				},
			});

			return result;
		}),
});

export default itemRouter;
