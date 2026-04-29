import api from "./api";

export async function applyJobService(payload) {
  const response = await api.post("/api/job-applications", payload);
  return response.data;
}

export async function getMyApplicationsService() {
  const response = await api.get("/api/job-applications/my");
  return response.data;
}