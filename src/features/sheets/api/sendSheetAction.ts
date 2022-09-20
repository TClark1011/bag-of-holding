import { SheetStateAction } from "../types/SheetState";
import { AxiosResponse } from "axios";
import { sheetsUrlPrefix } from "$root/constants";
import { axiosInstance } from "$root/config";

/**
 * Send a sheet-state related action to the server
 * to be processed and acted upon by the database
 * reducer.
 *
 * @param id The id of the sheet to be
 * acted upon
 * @param action The
 * action to be sent to the server
 * @returns The
 * resulting promise
 */
const sendSheetAction = (
	id: string,
	action: SheetStateAction
): Promise<void | AxiosResponse<void>> =>
	axiosInstance
		.patch(sheetsUrlPrefix + id, action)
		.then(() => action.onThen && action.onThen())
		.catch((err) => action.onCatch && action.onCatch(err))
		.finally(() => action.onFinally && action.onFinally());

export default sendSheetAction;
