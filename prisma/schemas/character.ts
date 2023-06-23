import * as z from "zod";
import * as imports from "../zod-prisma-helpers";

export const characterSchema = z.object({
	id: z.string(),
	name: z.string().and(imports.nameField),
	carryCapacity: z.number(),
	money: z.number().min(0),
	sheetId: z.string(),
});
