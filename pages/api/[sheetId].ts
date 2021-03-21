import { getRandomInventoryItems } from "./../../fixtures/itemFixtures";
import { NextApiHandler } from "next";
import { averageMembersFixture } from "../../fixtures/membersFixtures";
import inventoryStateReducer from "../../utils/inventorySheetStateReducer";

let sheetState = {
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
	res.status(200).json(sheetState);
};

/**
 * handle GET request
 *
 * @param {NextApiRequest} req The HTTP request object
 * @param {NextApiResponse} res The HTTP response object
 */
const handlePATCH: NextApiHandler = (req, res) => {
	const action = JSON.parse(req.body);
	sheetState = inventoryStateReducer(sheetState, action);
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
		case "PATCH":
			handlePATCH(req, res);
			break;
		case "GET":
		default:
			handleGET(req, res);
	}
};

export default routeHandler;
