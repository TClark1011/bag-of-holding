import prisma from "$prisma";
import { resolvedSetSheetNameActionSchema } from "$sheets/store/inventoryActions";
import trpc from "$trpc";
import { z } from "zod";

const sheetRouter = trpc.router({
	getFull: trpc.procedure.input(z.string().cuid()).query(({ input }) =>
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
		.input(resolvedSetSheetNameActionSchema)
		.mutation(async ({ input }) => {
			await prisma.sheet.update({
				where: {
					id: input.resolvedPayload.sheetId,
				},
				data: {
					name: input.resolvedPayload.newName,
				},
			});
		}),
	create: trpc.procedure.mutation(() =>
		prisma.sheet.create({
			data: {
				name: "New Sheet",
			},
		})
	),
});

export default sheetRouter;
