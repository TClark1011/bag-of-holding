import OmitId from "../utils/OmitId";

/**
 * @typedef {object} InventoryItemFields The fields for an inventory item
 * @property {string} _id The unique identifier
 * @property {string} name The name of the item
 * @property {number} quantity The quantity of the item
 * @property {string} [type] The type (essentially a category) of the item
 * @property {string} [description] Description of the item
 * @property {string} [carriedBy] The party member that is carrying the item
 * @property {number} [weight] How much the item weights (in 'lb')
 * @property {number} [value] The monetary value of the item
 * @property {string} [infoLink] A link to a document that contains more information about the item
 */
interface InventoryItemFields {
	_id: string;
	name: string;
	quantity: number;
	weight: number;
	type?: string;
	description?: string;
	carriedBy?: string;
	value?: number;
	infoLink?: string;
}

export type InventoryItemCreationFields = Omit<
	OmitId<InventoryItemFields>,
	"quantity" | "weight"
> &
	Partial<Pick<InventoryItemFields, "quantity" | "weight">>;
/**
 * The fields that are required to be input when creating a new inventory item.
 * We need this type because the fields 'quantity' and 'weight' are required fields,
 * however when producing a new item, we want these fields to be optional for the user
 * because we can apply defaults if values are not provided. For more information about
 * the defaults, see the 'createInventoryItem' function.
 */

export default InventoryItemFields;
