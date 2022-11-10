import { defaultFieldLength } from "$root/constants";
import { itemSchema } from "@prisma/schemas";
import { z } from "zod";

export const descriptionLength = 4000;
export const referenceLength = 200;

const prepareNumericString = (val: unknown) =>
	val === null ? val : Number(val);

const itemValidation = z
	.object({
		...itemSchema.shape,
		name: itemSchema.shape.name.max(defaultFieldLength),
		category: z.string().max(defaultFieldLength).optional().nullable(),
		description: z.string().optional().nullable(),
		quantity: z.preprocess(prepareNumericString, itemSchema.shape.quantity),
		weight: z.preprocess(prepareNumericString, itemSchema.shape.weight),
		value: z.preprocess(prepareNumericString, itemSchema.shape.value),
		id: z.string().nullable().default(null),
	})
	.omit({
		sheetId: true,
	});

export default itemValidation;
