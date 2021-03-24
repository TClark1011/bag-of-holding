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
		_id: faker.random.uuid(),
		carriedBy: "Nobody",
		category: "None",
		quantity: 1,
		//? quantity defaults to 1
		weight: 0,
		//? Weight defaults to 0
		...fields,
		//? Default 'quantity' and 'weight' values are overridden if they are present in fields
	};
};

/**
 * Generate a random inventory item
 *
 * @param {Partial<OmitId<InventoryItemFields>>} [fields] Fields that user can provide
 * predetermined values for (incl)
 * @param {string[]} [members] Party members. When the 'carriedBy' field is generated,
 * the value is a randomly selected item from this array if it is provided. If no
 * 'members' array is provided, 'carriedBy' is left undefined.
 * @returns {InventoryItemFields} A randomly generated item
 */
export const generateRandomInventoryItem = (
	{ _id, ...fields }: Partial<InventoryItemFields>,
	members?: string[]
): InventoryItemFields => {
	const randomCarriedBy = members ? { carriedBy: randomItem(members) } : {};
	//? Set 'carriedBy' by selecting random item from the 'members' array
	//? If 'members' array is not provided, 'carriedBy' is undefined
	const generatedItem = createInventoryItem({
		name: faker.commerce.productName(),
		quantity: faker.random.number({ min: 1, max: 12 }),
		value: faker.random.float({ min: 1, max: 300 }),
		category: faker.commerce.productAdjective(),
		description: faker.commerce.productDescription(),
		weight: faker.random.number({ min: 1, max: 200 }),
		...randomCarriedBy,
		...fields,
		//? All provided values from field will override randomly generated values
	});
	return { ...generatedItem, _id: _id || generatedItem._id };
};

//TODO: When generating random item, have random chance of optional fields being undefined

export default createInventoryItem;
