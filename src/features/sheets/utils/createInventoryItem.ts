import { ItemCreationFields } from "$sheets/types";
import { Item } from "@prisma/client";
import faker from "faker";

/**
 * Generate a new inventory item object
 * Takes all the required files, excluding "id"
 * Creates new object with randomly generated "id" along with the provided fields
 *
 * @param fields The data used to generate the new item
 * @returns A newly generated item
 */
const createInventoryItem = (fields: ItemCreationFields): Item => {
	return {
		id: faker.datatype.uuid(),
		carriedByCharacterId: null,
		quantity: 1,
		//? quantity defaults to 1
		weight: 0,
		//? Weight defaults to 0
		...fields,
		//? Default 'quantity' and 'weight' values are overridden if they are present in fields
	};
};

export default createInventoryItem;
