import { OmitId, StrictExtract } from "$root/types";
import { Item } from "@prisma/client";

export type ProcessableItemProperty = keyof OmitId<Item>;
//? Represents a property of an item that can be filtered/sorted;

export type FilterableItemProperty = StrictExtract<
	keyof Item,
	"carriedByCharacterId" | "category"
>;

// Item properties that are summed according to quantity
export type SummableItemProperty = StrictExtract<
	keyof Item,
	"weight" | "value"
>;

export type ItemCreationFields = Omit<OmitId<Item>, "quantity" | "weight"> &
	Partial<Pick<Item, "quantity" | "weight" | "id">>;
