import { axiosInstance } from "$root/config";
import { sheetsUrlPrefix } from "$root/constants";
import { FullSheet } from "$sheets/types";
import { AxiosResponse } from "axios";

/**
 * Fetch a sheet from the server
 *
 * @param id The 'id' if the sheet
 * to fetch
 * @returns The
 * fetched sheet
 */
const fetchSheet = (id: string): Promise<AxiosResponse<FullSheet>> =>
	axiosInstance.get<FullSheet>(sheetsUrlPrefix + id);

export default fetchSheet;
