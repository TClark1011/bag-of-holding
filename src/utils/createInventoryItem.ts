import InventoryItemFields, {
	InventoryItemCreationFields,
} from "../types/InventoryItemFields";
import faker from "faker";
import randomItem from "random-item";

/**
 * Generate a new inventory item object
 * Takes all the required files, excluding "_id"
 * Creates new object with randomly generated "_id" along with the provided fields
 *
 * @param {InventoryItemCreationFields} fields The data used to generate the new item
 * @returns {InventoryItemFields} A newly generated item
 */
const createInventoryItem = (
	fields: InventoryItemCreationFields
): InventoryItemFields => {
	return {
		_id: faker.datatype.uuid(),
		carriedBy: "Nobody",
		quantity: 1,
		//? quantity defaults to 1
		weight: 0,
		//? Weight defaults to 0
		...fields,
		//? Default 'quantity' and 'weight' values are overridden if they are present in fields
	};
};

export default createInventoryItem;
