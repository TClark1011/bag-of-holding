import { defaultFieldLength } from "$root/constants";
import { characterSchema } from "@prisma/schemas";
import { z } from "zod";

const sheetOptionsValidation = z.object({
	name: z.string().max(defaultFieldLength),
	characters: z.array(characterSchema.omit({ sheetId: true })).default([]),
});

export default sheetOptionsValidation;
