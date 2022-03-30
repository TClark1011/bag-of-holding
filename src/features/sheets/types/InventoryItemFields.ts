import { IdentifiedObject, OmitId } from "$root/types";

/**
 * @typedef {object} InventoryItemFields The fields for an inventory item
 * @augments IdentifiedObject
 * @property {string} name The name of the item (max length: 24 chars)
 * @property {number} quantity The quantity of the item
 * @property {number} weight How much the item weights (assumed to be in 'lb')
 * @property {string} [category] The type (essentially a category) of the item
 * @property {string} [description] Description of the item
 * @property {string} [carriedBy] The party member that is carrying the item
 * @property {number} [value] The monetary value of the item
 * @property {string} [infoLink] A link to a document that contains more information about the item
 */
interface InventoryItemFields extends IdentifiedObject {
	name: string;
	quantity: number;
	weight: number;
	category?: string;
	description?: string;
	carriedBy?: string;
	value?: number;
	reference?: string;
}

export type ProcessableItemProperty = keyof OmitId<InventoryItemFields>;
//? Represents a property of an item that can be filtered/sorted;

export type FilterableItemProperty = keyof InventoryItemFields &
	("carriedBy" | "category");

export type SummableItemProperty = keyof InventoryItemFields &
	("weight" | "value");

export type InventoryItemCreationFields = Omit<
	OmitId<InventoryItemFields>,
	"quantity" | "weight"
> &
	Partial<Pick<InventoryItemFields, "quantity" | "weight" | "_id">>;
/**
 * The fields that are required to be input when creating a new inventory item.
 * We need this type because the fields 'quantity' and 'weight' are required fields,
 * however when producing a new item, we want these fields to be optional for the user
 * because we can apply defaults if values are not provided. For more information about
 * the defaults, see the 'createInventoryItem' function.
 */

export default InventoryItemFields;
