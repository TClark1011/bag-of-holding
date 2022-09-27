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
/**
 * The fields that are required to be input when creating a new inventory item.
 * We need this type because the fields 'quantity' and 'weight' are required fields,
 * however when producing a new item, we want these fields to be optional for the user
 * because we can apply defaults if values are not provided. For more information about
 * the defaults, see the 'createInventoryItem' function.
 */
