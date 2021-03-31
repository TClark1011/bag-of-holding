import { InventorySheetStateAction } from "./../types/InventorySheetState";
import { AxiosResponse } from "axios";
import axiosInstance from "../config/axiosInstance";
import { sheetsUrlPrefix } from "../constants/urls";

/**
 * @param _id
 * @param action
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
