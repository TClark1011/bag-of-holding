import InventoryItemFields from "../types/InventoryItemFields";
import faker from "faker";
import OmitId from "./OmitId";
import randomItem from "random-item";

/**
 * Generate a new inventory item object
 * Takes all the required files, excluding "_id"
 * Creates new object with randomly generated "_id" along with the provided fields
 *
 * @param {Omit<OmitId<InventoryItemFields>, "quantity"> & { quantity?: number }} fields The fields to pass to the object
 * The confusing type is to remove the required "_id" and "quantity" fields so that they do not need to be passed in the
 * paramter. We use a union to add the quantity field back in as an optional field. If quantity is not provided, it
 * defaults to 1.
 * @returns {InventoryItemFields} A newly generated item
 */
const createInventoryItem = (
	fields: Omit<OmitId<InventoryItemFields>, "quantity"> & { quantity?: number }
): InventoryItemFields => {
	return {
		_id: faker.random.uuid(),
		quantity: fields.quantity | 1,
		...fields,
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
		quantity: faker.random.number({ min: 1, max: 12, precision: 0 }),
		value: faker.random.number({ min: 1, max: 300, precision: 3 }),
		type: faker.commerce.productAdjective(),
		description: faker.commerce.productDescription(),
		weight: faker.random.number({ min: 1, max: 200, precision: 0 }),
		...randomCarriedBy,
		...fields,
		//? All provided values from field will override randomly generated values
	});
	return { ...generatedItem, _id: _id || generatedItem._id };
};

export default createInventoryItem;
