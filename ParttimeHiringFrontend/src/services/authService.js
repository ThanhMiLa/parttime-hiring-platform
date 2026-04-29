import api from "./api";
import { API_ENDPOINTS } from "../constants/api";

export async function loginService(payload) {
  const response = await api.post(API_ENDPOINTS.auth.login, payload);
  return response.data;
}

export async function registerService(payload) {
  const response = await api.post(API_ENDPOINTS.auth.register, payload);
  return response.data;
}

export async function logoutService(payload) {
  const response = await api.post(API_ENDPOINTS.auth.logout, payload);
  return response.data;
}

export async function getMeService() {
  const response = await api.get(API_ENDPOINTS.auth.me);
  return response.data;
}