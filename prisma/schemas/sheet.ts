import * as z from "zod";
import * as imports from "../zod-prisma-helpers";

export const sheetSchema = z.object({
	updatedAt: z.date(),
	id: z.string(),
	name: z.string().and(imports.nameField),
	partyMoney: z.number(),
});
