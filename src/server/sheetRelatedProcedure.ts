import prisma from "$prisma";
import trpc from "$trpc";
import { matchesSchema } from "$zod-helpers";
import { characterSchema } from "prisma/schemas/character";
import { itemSchema } from "prisma/schemas/item";
import { z } from "zod";

const sheetUpdateMiddleware = trpc.middleware(async ({ next, type }) => {
	// We use middleware so that whenever an entity that is related to a sheet
	// is changed, we update the sheet's updatedAt field.
	// This is so on the frontend we can very quickly check if fetched data is
	// new by comparing its `updatedAt` field to the what is stored in client
	// state
	const endResult = await next();

	if (type !== "mutation" || !endResult.ok) return endResult;

	const sheetId: string | null = matchesSchema(
		endResult,
		z.object({ data: itemSchema.or(characterSchema) })
	)
		? endResult.data.sheetId
		: null;

	if (sheetId) {
		await prisma.sheet.update({
			where: {
				id: sheetId,
			},
			data: {
				updatedAt: new Date(),
			},
		});
	}

	return endResult;
});

const sheetRelatedProcedure = trpc.procedure.use(sheetUpdateMiddleware);

export default sheetRelatedProcedure;
