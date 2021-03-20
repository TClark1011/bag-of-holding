import { getRandomInventoryItems } from "../fixtures/itemFixtures";
import { averageMembersFixture } from "../fixtures/membersFixtures";
import InventorySheetFields from "../types/InventorySheetFields";

const premadeRandomSheet = {
	name: "Test Sheet",
	items: getRandomInventoryItems(),
	members: averageMembersFixture,
};

/**
 * Fetch sheet from MongoDB
 *
 * @param {string} _id The '_id' of the sheet to fetch
 * @returns {InventPromise<InventorySheetFields>orySheetFields} Fetched inventory sheet field
 */
export const fetchSheetFromMongo = async (
	_id: string
): Promise<InventorySheetFields> => premadeRandomSheet;
//? This is placeholder code until mongoDB is implemented
