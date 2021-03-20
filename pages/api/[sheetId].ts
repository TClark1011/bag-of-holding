import { getRandomInventoryItems } from "./../../fixtures/itemFixtures";
import { NextApiHandler } from "next";
import { averageMembersFixture } from "../../fixtures/membersFixtures";
import inventoryStateReducer from "../../utils/inventoryStateReducer";

const sheetState = {
	name: "Test Sheet",
	items: getRandomInventoryItems(),
	members: averageMembersFixture,
};

/**
 * handle GET request
 *
 * @param {NextApiRequest} req The HTTP request object
 * @param {NextApiResponse} res The HTTP response object
 */
const handleGET: NextApiHandler = async (req, res) => {
	// res
	// 	.status(200)
	// 	.json(await fetchSheetFromMongo(getUrlParam(req.query.sheetId)));
	res.status(200).json(sheetState);
};

/**
 * handle GET request
 *
 * @param {NextApiRequest} req The HTTP request object
 * @param {NextApiResponse} res The HTTP response object
 */
const handleUPDATE: NextApiHandler = (req, res) => {
	sheetState.items = inventoryStateReducer(sheetState.items, req.body);
	res.status(200).json(sheetState);
};

/**
 * Handle GET requests to the route
 *
 * @param {NextApiRequest} req The HTTP request object
 * @param {NextApiResponse} res The HTTP response object
 */
const routeHandler: NextApiHandler = (req, res) => {
	switch (req.method) {
		case "UPDATE":
			handleUPDATE(req, res);
			break;
		case "GET":
		default:
			handleGET(req, res);
	}
};

export default routeHandler;
