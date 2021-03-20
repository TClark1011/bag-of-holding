// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiHandler } from "next";
import { getRandomInventoryItems } from "../../fixtures/itemFixtures";
import { averageMembersFixture } from "../../fixtures/membersFixtures";
import InventorySheetFields from "../../types/InventorySheetFields";

const sheet: InventorySheetFields = {
	name: "Test Sheet",
	items: getRandomInventoryItems(),
	members: averageMembersFixture,
};

/**
 * Handle GET requests to the route
 *
 * @param {NextApiRequest} req The HTTP request object
 * @param {NextApiResponse} res The HTTP response object
 */
const routeHandler: NextApiHandler = (req, res) => {
	res.status(200).json(sheet);
};

export default routeHandler;
