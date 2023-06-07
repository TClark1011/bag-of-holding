import { Item } from "@prisma/client";

export const itemPropertyLabels: Record<keyof Item, string> = {
	carriedByCharacterId: "Carried By",
	category: "Category",
	description: "Description",
	id: "id",
	name: "Name",
	quantity: "Quantity",
	referenceLink: "Reference",
	sheetId: "Sheet",
	weight: "Weight",
	value: "Value",
};
