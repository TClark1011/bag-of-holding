import { NextApiHandler } from "next";
import createSheetFromFlatData, {
	SheetFlatDataCreation,
} from "$backend/createSheetFromFlatData";

/**
 * Handle HTTP requests to the route
 *
 * @param req The HTTP request object
 * @param res The HTTP response object
 */
const routeHandler: NextApiHandler = async (req, res) => {
	if (req.method === "GET") {
		const fields: SheetFlatDataCreation = {
			name: "New Sheet",
			characters: [],
			items: [],
		};
		const item = await createSheetFromFlatData(fields);
		res.status(200).send(item.id);
		return;
	}
	res.status(500).send("error");
};

export default routeHandler;
