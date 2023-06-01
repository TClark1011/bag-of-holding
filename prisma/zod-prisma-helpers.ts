import { z } from "zod";

const MAX_NAME_LENGTH = 50;
export const nameField = z
	.string()
	.min(1, { message: "Name cannot be empty" })
	.max(MAX_NAME_LENGTH, {
		message: `Name cannot be longer than ${MAX_NAME_LENGTH} characters`,
	});
