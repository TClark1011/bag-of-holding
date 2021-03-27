import { NextApiHandler } from "next";
import SheetModel from "../../db/SheetModel";
import OmitId from "../../utils/OmitId";
import InventorySheetFields from "../../types/InventorySheetFields";

/**
 * Handle HTTP requests to the route
 *
 * @param {NextApiRequest} req The HTTP request object
 * @param {NextApiResponse} res The HTTP response object
 */
const routeHandler: NextApiHandler = async (req, res) => {
	if (req.method === "POST") {
		const fields: OmitId<InventorySheetFields> = {
			name: "New Sheet",
			members: [],
			items: [],
		};
		const item = await new SheetModel(fields).save();
		res.status(200).send(item._id);
		return;
	}
	res.status(500);
};

export default routeHandler;
