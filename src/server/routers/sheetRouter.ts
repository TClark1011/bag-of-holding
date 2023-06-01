import prisma from "$prisma";
import trpc from "$trpc";
import { z } from "zod";

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
});

export default sheetRouter;
