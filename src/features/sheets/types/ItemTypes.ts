import { OmitId } from "$root/types";
import { Item } from "@prisma/client";

export type ProcessableItemProperty = keyof OmitId<Item>;
//? Represents a property of an item that can be filtered/sorted;

export type ItemCreationFields = Omit<OmitId<Item>, "quantity" | "weight"> &
	Partial<Pick<Item, "quantity" | "weight" | "id">>;
