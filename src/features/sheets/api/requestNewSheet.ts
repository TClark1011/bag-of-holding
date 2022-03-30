import { axiosInstance } from "$root/config";
import { newSheetApiRoute } from "$root/constants";
import { AxiosResponse } from "axios";

/**
 * Request a new sheet be created.
 *
 * @returns When the new
 * sheet is created, it's '_id' field is returned
 */
const requestNewSheet = (): Promise<AxiosResponse<string>> =>
	axiosInstance.get(newSheetApiRoute);

export default requestNewSheet;
