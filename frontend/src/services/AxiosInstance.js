import axios from "axios";

const axiosInstance = axios.create({
  withCredentials: true, // Include cookies in all requests
});

export default axiosInstance;