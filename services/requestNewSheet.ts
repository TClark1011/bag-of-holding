import { AxiosResponse } from "axios";
import axiosInstance from "../config/axiosInstance";
import { newSheetApiRoute } from "../constants/urls";

/**
 * Request a new sheet be created.
 *
 * @returns {Promise<AxiosResponse<string>>} When the new
 * sheet is created, it's '_id' field is returned
 */
const requestNewSheet = (): Promise<AxiosResponse<string>> =>
	axiosInstance.get(newSheetApiRoute);

export default requestNewSheet;
