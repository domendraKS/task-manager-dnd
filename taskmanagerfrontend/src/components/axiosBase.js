import axios from "axios";
import Cookies from "js-cookie";

// const token = Cookies.get("userTokenTask");
// console.log(token);
// const api = axios.create({
//   baseURL: import.meta.env.VITE_APP_API_URI,
//   withCredentials: true,
//   headers: {
//     Authorization: `Bearer ${token}`,
//     "Content-Type": "application/json",
//   },
// });

const token = localStorage.getItem("userTokenTask");
// console.log(token);
const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URI,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

export default api;
