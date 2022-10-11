import prisma from "$prisma";
import sheetRelatedProcedure from "$root/server/sheetRelatedProcedure";
import {
	deleteItemActionSchema,
	resolvedCreateItemActionSchema,
	updateItemActionSchema,
} from "$sheets/store/inventoryActions";
import trpc from "$trpc";

const itemRouter = trpc.router({
	create: sheetRelatedProcedure
		.input(resolvedCreateItemActionSchema)
		.mutation(async ({ input }) => {
			const item = await prisma.item.create({
				data: input.resolvedPayload,
			});

			await prisma.sheet.update({
				where: {
					id: input.resolvedPayload.sheetId,
				},
				data: {},
			});

			return item;
		}),
	update: sheetRelatedProcedure
		.input(updateItemActionSchema)
		.mutation(async ({ input }) => {
			const item = await prisma.item.update({
				where: {
					id: input.payload.itemId,
				},
				data: input.payload.data,
			});

			return item;
		}),
	delete: sheetRelatedProcedure
		.input(deleteItemActionSchema)
		.mutation(async ({ input }) => {
			const result = await prisma.item.delete({
				where: {
					id: input.payload.itemId,
				},
			});

			return result;
		}),
});

export default itemRouter;
