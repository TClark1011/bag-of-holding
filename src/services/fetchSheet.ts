import { sheetsUrlPrefix } from "../constants/urls";
import axiosInstance from "../config/axiosInstance";
import InventorySheetFields from "../types/InventorySheetFields";
import { AxiosResponse } from "axios";

/**
 * Fetch a sheet from the server
 *
 * @param {string} _id The '_id' if the sheet
 * to fetch
 * @returns {Promise<InventorySheetFields>} The
 * fetched sheet
 */
const fetchSheet = (
	_id: string
): Promise<AxiosResponse<InventorySheetFields>> =>
	axiosInstance.get<InventorySheetFields>(sheetsUrlPrefix + _id);

export default fetchSheet;
