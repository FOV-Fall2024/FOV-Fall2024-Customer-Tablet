import axios from "axios";
const axioClient = axios.create({
  baseURL: "https://6639726e1ae792804bebbf8f.mockapi.io/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axioClient;
