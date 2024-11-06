import axios from "axios";
const axioClient = axios.create({
  baseURL: "http://vktrng.ddns.net:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axioClient;
