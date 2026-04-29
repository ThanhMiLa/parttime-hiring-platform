import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../constants/api";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  setCurrentUser,
  clearAuthData,
} from "../utils/tokenStorage";

const api = axios.create({
  baseURL: API_BASE_URL,
});

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
}

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isUnauthorized = error?.response?.status === 401;
    const refreshToken = getRefreshToken();
    const isRefreshRequest = originalRequest?.url?.includes(API_ENDPOINTS.auth.refresh);

    if (isUnauthorized && refreshToken && !originalRequest?._retry && !isRefreshRequest) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.auth.refresh}`, {
          refreshToken,
        });

        const refreshResult = response?.data?.result;

        setTokens(refreshResult?.accessToken, refreshResult?.refreshToken);

        const meResponse = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.auth.me}`, {
          headers: {
            Authorization: `Bearer ${refreshResult?.accessToken}`,
          },
        });

        const me = meResponse?.data?.result;

        setCurrentUser({
          id: me?.id ?? refreshResult?.id,
          displayName: me?.displayName ?? refreshResult?.displayName,
          username: me?.username ?? refreshResult?.username,
          dob: me?.dob ?? refreshResult?.dob,
          roles: (me?.roles || []).map((role) => role.name),
        });

        processQueue(null, refreshResult?.accessToken);

        originalRequest.headers.Authorization = `Bearer ${refreshResult?.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuthData();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;