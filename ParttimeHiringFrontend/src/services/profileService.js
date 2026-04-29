import api from "./api";
import { API_ENDPOINTS } from "../constants/api";

export async function getProfileService() {
  const response = await api.get(API_ENDPOINTS.auth.me);
  return response.data;
}