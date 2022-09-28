import { asActionSchema } from "$actions";
import prisma from "$prisma";
import trpc from "$trpc";
import { itemSchema } from "@prisma/schemas";
import { z } from "zod";

const itemRouter = trpc.router({
	create: trpc.procedure
		.input(asActionSchema(itemSchema))
		.mutation(async ({ input }) => {
			const item = await prisma.item.create({
				data: input.payload,
			});

			return item;
		}),
	update: trpc.procedure
		.input(
			asActionSchema(
				z.object({
					itemId: z.string(),
					updateData: itemSchema.partial(),
				})
			)
		)
		.mutation(async ({ input }) => {
			const item = await prisma.item.update({
				where: {
					id: input.payload.itemId,
				},
				data: input.payload.updateData,
			});

			return item;
		}),
	delete: trpc.procedure
		.input(asActionSchema(z.object({ itemId: z.string() })))
		.mutation(async ({ input }) => {
			await prisma.item.delete({
				where: {
					id: input.payload.itemId,
				},
			});
		}),
});

export default itemRouter;
