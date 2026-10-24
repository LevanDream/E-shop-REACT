import axios from "axios";

const SHOP_API_URL = "https://dummyjson.com";

export const shopHttp = axios.create({
  baseURL: SHOP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
