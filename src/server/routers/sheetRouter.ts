import { asActionSchema } from "$actions";
import prisma from "$prisma";
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
		.input(
			asActionSchema(
				z.object({
					sheetId: z.string(),
					newName: z.string(),
				})
			)
		)
		.mutation(async ({ input }) => {
			await prisma.sheet.update({
				where: {
					id: input.payload.sheetId,
				},
				data: {
					name: input.payload.newName,
				},
			});
		}),
});

export default sheetRouter;
