import { apiRootUrl } from "./../constants/urls";
import axios from "axios";

const axiosInstance = axios.create({
	baseURL: apiRootUrl,
});

export default axiosInstance;
