import { NextApiHandler, NextApiRequest } from "next";
import inventoryStateReducer from "../../utils/inventorySheetStateReducer";
import "../../db/sheetServices";
import { fetchSheet, updateSheet } from "../../db/sheetServices";

/**
 * Pull the sheetId url parameter for a requests url
 * @param {NextApiRequest} req The request object
 * @returns {string} The sheetId url parameter
 */
const getSheetId = (req: NextApiRequest): string => req.query.sheetId as string;

// let sheetState: InventorySheetFields = {
// 	_id: faker.random.uuid(),
// 	name: "Test Sheet",
// 	items: getRandomInventoryItems(),
// 	members: averageMembersFixture,
// };

/**
 * handle GET request
 *
 * @param {NextApiRequest} req The HTTP request object
 * @param {NextApiResponse} res The HTTP response object
 */
const handleGET: NextApiHandler = async (req, res) => {
	// console.log("([sheetId]) req.query: ", req.query);
	const data = await fetchSheet(getSheetId(req));
	res.status(200).json(data);
};

/**
 * handle GET request
 *
 * @param {NextApiRequest} req The HTTP request object
 * @param {NextApiResponse} res The HTTP response object
 */
const handlePATCH: NextApiHandler = async (req, res) => {
	const action = JSON.parse(req.body);
	const currentState = await fetchSheet(getSheetId(req));
	console.log("([sheetId]) currentState: ", currentState);
	const newState = inventoryStateReducer(currentState, action);
	console.log("([sheetId]) newState: ", newState);

	updateSheet(newState);
	res.status(200).json(newState);
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
