import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4444/v1",
});

export default api;
