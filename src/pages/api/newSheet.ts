import { NextApiHandler } from "next";
import SheetModel from "$root/db/SheetModel";
import { OmitId } from "$root/types";
import connectToMongoose from "$root/db/connectToMongoose";
import { InventorySheetFields } from "$sheets/types";

connectToMongoose();

/**
 * Handle HTTP requests to the route
 *
 * @param req The HTTP request object
 * @param res The HTTP response object
 */
const routeHandler: NextApiHandler = async (req, res) => {
	if (req.method === "GET") {
		const fields: OmitId<InventorySheetFields> = {
			name: "New Sheet",
			members: [],
			items: [],
		};
		const item = await new SheetModel(fields).save();
		res.status(200).send(item._id);
		return;
	}
	res.status(500).send("error");
};

export default routeHandler;
