import api from "./api";
import { API_ENDPOINTS } from "../constants/api";

export async function getJobsService(page = 0, size = 12) {
  const response = await api.get(
    `${API_ENDPOINTS.jobs.list}?page=${page}&size=${size}`
  );
  return response.data;
}

export async function getJobDetailService(jobId) {
  const response = await api.get(`${API_ENDPOINTS.jobs.detail}/${jobId}`);
  return response.data;
}

export async function getJobCategoriesService() {
  const response = await api.get(API_ENDPOINTS.jobs.categories);
  return response.data;
}

export async function getWorkShiftsService() {
  const response = await api.get(API_ENDPOINTS.jobs.workShifts);
  return response.data;
}

export async function searchJobsService(searchPayload, page = 0, size = 12) {
  const response = await api.post(
    `${API_ENDPOINTS.jobs.search}?page=${page}&size=${size}`,
    searchPayload
  );
  return response.data;
}

export function extractSingleJobFromDetailResponse(responseData, jobId) {
  // API thực tế trả về { result: { ...job } }
  if (responseData && responseData.result && responseData.result.id) {
    return responseData.result;
  }
  return null;
}
