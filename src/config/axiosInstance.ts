import { apiRootUrl } from "$root/constants";
import axios from "axios";

const axiosInstance = axios.create({
	baseURL: apiRootUrl,
});

export default axiosInstance;
