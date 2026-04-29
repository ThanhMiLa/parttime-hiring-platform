import api from "./api";

export async function getEmployerStoresService() {
  const response = await api.get("/api/employer/stores");
  return response.data;
}

export async function getEmployerStoreDetailService(storeId) {
  const response = await api.get(`/api/employer/stores/${storeId}`);
  return response.data;
}

export async function createEmployerStoreService(payload) {
  const response = await api.post("/api/employer/stores", payload);
  return response.data;
}

export async function updateEmployerStoreService(storeId, payload) {
  const response = await api.put(`/api/employer/stores/${storeId}`, payload);
  return response.data;
}

export async function countEmployerStoresService() {
  const response = await api.get("/api/employer/stores/count");
  return response.data;
}

export async function countApplicationsByStoreService(storeId) {
  const response = await api.get(`/api/employer/stores/${storeId}/applications/count`);
  return response.data;
}

export async function getEmployerJobPostsByStoreService(storeId) {
  const response = await api.get(`/api/employer/job-posts/by-store/${storeId}`);
  return response.data;
}

export async function getEmployerJobPostDetailService(jobPostId) {
  const response = await api.get(`/api/employer/job-posts/${jobPostId}`);
  return response.data;
}

export async function createEmployerJobPostService(payload) {
  const response = await api.post("/api/employer/job-posts", payload);
  return response.data;
}

export async function updateEmployerJobPostService(jobPostId, payload) {
  const response = await api.put(`/api/employer/job-posts/${jobPostId}`, payload);
  return response.data;
}

export async function countEmployerActiveJobPostsService() {
  const response = await api.get("/api/employer/job-posts/count");
  return response.data;
}

export async function countApplicationsByJobPostService(jobPostId) {
  const response = await api.get(`/api/employer/job-posts/${jobPostId}/applications/count`);
  return response.data;
}

export async function getJobApplicationsByJobPostService(jobPostId) {
  const response = await api.get(`/api/employer/job-posts/${jobPostId}/applications`);
  return response.data;
}

export async function updateJobApplicationStatusService(applicationId, status) {
  const response = await api.patch(
    `/api/employer/applications/${applicationId}/status`,
    null,
    {
      params: { status },
    }
  );
  return response.data;
}

export async function countPendingApplicationsOfEmployerService() {
  const response = await api.get("/api/employer/job-posts/applications/count");
  return response.data;
}