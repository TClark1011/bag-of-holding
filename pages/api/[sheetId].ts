import { NextApiHandler, NextApiRequest } from "next";
import inventoryStateReducer from "../../state/inventoryReducer";
import "../../db/sheetServices";
import { fetchSheet, updateSheet } from "../../db/sheetServices";
import dbReducer from "../../db/dbReducer";

//NOTE: Apparently the NextJS 'API resolved without sending a response for..." errors are false positives and can be ignored.
// As seen here "https://github.com/vercel/next.js/issues/10439" it is a known issue with NextJS/Mongoose compatibility

/**
 * Pull the sheetId url parameter for a requests url
 *
 * @param {NextApiRequest} req The request object
 * @returns {string} The sheetId url parameter
 */
const getSheetId = (req: NextApiRequest): string => req.query.sheetId as string;

/**
 * handle GET request
 *
 * @param {NextApiRequest} req The HTTP request object
 * @param {NextApiResponse} res The HTTP response object
 */
const handleGET: NextApiHandler = async (req, res) => {
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

	// const currentState = await fetchSheet(getSheetId(req));
	// const newState = inventoryStateReducer(currentState, action);
	// updateSheet(newState);

	dbReducer(getSheetId(req), action);

	res.status(200).json({});
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
