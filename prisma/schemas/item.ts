import * as z from "zod";
import * as imports from "../zod-prisma-helpers";

export const itemSchema = z.object({
	id: z.string(),
	name: z.string().and(imports.nameField),
	description: z.string().nullish(),
	weight: z.number().min(0).nullish(),
	quantity: z.number().min(0),
	referenceLink: z.string().nullish(),
	category: z.string().nullish(),
	value: z.number().min(0).nullish(),
	carriedByCharacterId: z.string().nullish(),
	sheetId: z.string(),
});
