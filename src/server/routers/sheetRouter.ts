import prisma from "$prisma";
import trpc from "$trpc";
import { isAfter } from "date-fns";
import { z } from "zod";

const sheetRouter = trpc.router({
	getFull: trpc.procedure.input(z.string()).query(({ input }) =>
		prisma.sheet.findUniqueOrThrow({
			where: {
				id: input,
			},
			include: {
				characters: true,
				items: true,
			},
		})
	),
	updateExists: trpc.procedure
		.input(
			z.object({
				sheetId: z.string(),
				updatedAt: z.date(),
			})
		)
		.output(z.boolean())
		.query(async ({ input }) => {
			const sheet = await prisma.sheet.findUniqueOrThrow({
				where: {
					id: input.sheetId,
				},
				select: {
					updatedAt: true,
				},
			});

			const updateExists = isAfter(sheet.updatedAt, input.updatedAt);

			return updateExists;
		}),
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
