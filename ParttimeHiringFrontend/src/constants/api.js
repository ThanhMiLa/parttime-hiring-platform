export const API_BASE_URL = "https://parttimejobbackend.onrender.com/parttimejob";

export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    me: "/auth/me",
  },
  jobs: {
    list: "/api/job-posts",
    detail: "/api/job-posts",
    search: "/api/job-posts/search",
    categories: "/api/job-categories",
    workShifts: "/api/work-shifts",
  },
};