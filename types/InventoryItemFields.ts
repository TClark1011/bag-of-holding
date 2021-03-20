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
	type?: string;
	description?: string;
	carriedBy?: string;
	weight?: number;
	value?: number;
	infoLink?: string;
}

export default InventoryItemFields;
