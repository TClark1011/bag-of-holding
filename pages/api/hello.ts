// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiHandler } from "next";

/**
 * Handle GET requests to the route
 *
 * @param {NextApiRequest} req The HTTP request object
 * @param {NextApiResponse} res The HTTP response object
 */
const routeHandler: NextApiHandler = (req, res) => {
	res.status(200).json({ name: "John Doe" });
};

export default routeHandler;
