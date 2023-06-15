/* eslint-disable no-console */
import prisma from "$prisma";
import { getOldSheetCutOff } from "$root/utils";
import { NextApiHandler } from "next";

/**
 * Handle a 'DELETE' request and delete all sheets that are more than
 * a month old and have no items
 *
 * @param req HTTP request object
 * @param res HTTP response object
 */
const routeHandler: NextApiHandler = async (req, res) => {
	if (req.method !== "DELETE") {
		res.status(405).send("Request method not implemented");
	}
	console.log("deleting old sheets...");

	await prisma.sheet
		.deleteMany({
			where: {
				updatedAt: {
					lt: getOldSheetCutOff(),
				},
			},
		})
		.then((data) => {
			const resultStr = `deleted ${data.count} sheets`;
			res.status(200).send(resultStr);
			console.log(resultStr);
		})
		.catch((err) => {
			res.status(500).send("an error occurred while deleting old sheets");
			throw err;
		});
};
export default routeHandler;
