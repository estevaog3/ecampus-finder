import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5555/v1",
});

export default api;
