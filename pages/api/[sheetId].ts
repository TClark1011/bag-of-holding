import { NextApiHandler, NextApiRequest } from "next";
import dbReducer from "../../db/dbReducer";
import fetchSheet from "../../db/fetchSheet";

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
	try {
		const data = await fetchSheet(getSheetId(req));
		res.status(200).json(data);
	} catch {
		res.status(500).send("There was an error");
	}
};

/**
 * handle GET request
 *
 * @param {NextApiRequest} req The HTTP request object
 * @param {NextApiResponse} res The HTTP response object
 */
const handlePATCH: NextApiHandler = async (req, res) => {
	const action = JSON.parse(req.body);
	dbReducer(getSheetId(req), action);
	res.status(200).json({});
};

/**
 * Handle HTTP requests to the route
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
			handleGET(req, res);
			break;
		default:
			res.status(400).send("Invalid request method");
	}
};

export default routeHandler;
