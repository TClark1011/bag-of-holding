import { InventorySheetStateAction } from "./../types/InventorySheetState";
import { AxiosResponse } from "axios";
import axiosInstance from "../config/axiosInstance";
import { sheetsUrlPrefix } from "../constants/urls";

/**
 * Send a sheet-state related action to the server
 * to be processed and acted upon by the database
 * reducer.
 *
 * @param {string} _id The id of the sheet to be
 * acted upon
 * @param {InventorySheetStateAction} action The
 * action to be sent to the server
 * @returns {Promise<void | AxiosResponse<void>>} The
 * resulting promise
 */
const sendSheetAction = (
	_id: string,
	action: InventorySheetStateAction
): Promise<void | AxiosResponse<void>> =>
	axiosInstance
		.patch(sheetsUrlPrefix + _id, action)
		.then(() => action.onThen && action.onThen())
		.catch((err) => action.onCatch && action.onCatch(err))
		.finally(() => action.onFinally && action.onFinally());

export default sendSheetAction;
