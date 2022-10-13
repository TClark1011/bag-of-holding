import { z } from "zod";

export const sortingDirectionSchema = z.union([
	z.literal("ascending"),
	z.literal("descending"),
]);
export type SortingDirection = z.infer<typeof sortingDirectionSchema>;
