import createSheetFromFlatData from "$backend/createSheetFromFlatData";
import { TESTING_ADMIN_KEY } from "$root/config";
import { generateRandomInventorySheet } from "$tests/utils/randomGenerators";
import { NextApiHandler } from "next";
import SuperJSON from "superjson";

const handleGET: NextApiHandler<
	| {
			superJsonStringifiedSheet: string;
	  }
	| string
> = async (req, res) => {
	const requestAuthHeader = req.headers.authorization;

	if (requestAuthHeader !== `Bearer: ${TESTING_ADMIN_KEY}`) {
		return res.status(401).send("Unauthorized");
	}

	const sheetData = generateRandomInventorySheet();
	const actualSheet = await createSheetFromFlatData(sheetData);

	return res.status(200).json({
		superJsonStringifiedSheet: SuperJSON.stringify(actualSheet),
	});
};

const handler: NextApiHandler = async (req, res) => {
	switch (req.method) {
		case "GET":
			return handleGET(req, res);
		default:
			return res.status(405).send("Method not allowed");
	}
};

export default handler;
