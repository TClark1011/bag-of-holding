import { subMonths } from "date-fns";
import { NextApiHandler } from "next";
import { connectToMongoose } from "$backend/utils";
import { SheetModel } from "$backend/models";

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
	await connectToMongoose();

	await SheetModel.deleteMany({
		updatedAt: { $lt: subMonths(Date.now(), 1) },
		"items.0": { $exists: true },
	})
		.then((data) => {
			const resultStr = `deleted ${data.deletedCount} sheets`;
			res.status(200).send(resultStr);
			console.log(resultStr);
		})
		.catch((err) => {
			res.status(500).send("an error occurred while deleting old sheets");
			throw Error(err);
		});
};
export default routeHandler;
