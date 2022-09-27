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
});

export default sheetRouter;
