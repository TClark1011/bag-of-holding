import dbReducer from "$backend/dbReducer";
import prisma from "$prisma";
import { tryCatch } from "$root/utils";
import { FullSheet } from "$sheets/types";
import { itemValidation } from "$sheets/validation";
import { NextApiHandler, NextApiRequest } from "next";

/**
 * Pull the sheetId url parameter for a requests url
 *
 * @param req The request object
 * @returns The sheetId url parameter
 */
const getSheetId = (req: NextApiRequest): string => req.query.sheetId as string;

/**
 * handle GET request
 *
 * @param req The HTTP request object
 * @param res The HTTP response object
 */
const handleGET: NextApiHandler<FullSheet | string> = async (req, res) => {
	try {
		const data = await prisma.sheet.findFirstOrThrow({
			where: {
				id: getSheetId(req),
			},
			include: {
				items: true,
				characters: true,
			},
		});
		res.status(200).json(data);
	} catch {
		res.status(500).send("There was an error");
	}
};

/**
 * handle GET request
 *
 * @param req The HTTP request object
 * @param res The HTTP response object
 */
const handlePATCH: NextApiHandler = async (req, res) => {
	const data: any = tryCatch(
		() => itemValidation.validateSync(req.body.data),
		() => req.body.data
	);

	if (itemValidation.isValidSync(data)) {
		console.log(`([sheetId]) (${Date.now()}) data: `, data);
		(data as any).id = (data as any).id || undefined; // if item id is empty string, set to undefined
	}

	await dbReducer(getSheetId(req), { ...req.body, data });
	return res.status(200).json({});
};

/**
 * Handle HTTP requests to the route
 *
 * @param req The HTTP request object
 * @param res The HTTP response object
 */
const routeHandler: NextApiHandler = (req, res) => {
	switch (req.method) {
		case "PATCH":
			return handlePATCH(req, res);
		case "GET":
			return handleGET(req, res);
		default:
			return res.status(400).send("Invalid request method");
	}
};

export default routeHandler;
