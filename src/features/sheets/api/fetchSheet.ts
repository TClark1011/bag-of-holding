import { axiosInstance } from "$root/config";
import { sheetsUrlPrefix } from "$root/constants";
import { InventorySheetFields } from "$sheets/types";
import { AxiosResponse } from "axios";

/**
 * Fetch a sheet from the server
 *
 * @param _id The '_id' if the sheet
 * to fetch
 * @returns The
 * fetched sheet
 */
const fetchSheet = (
	_id: string
): Promise<AxiosResponse<InventorySheetFields>> =>
	axiosInstance.get<InventorySheetFields>(sheetsUrlPrefix + _id);

export default fetchSheet;
