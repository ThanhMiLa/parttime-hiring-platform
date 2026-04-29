import api from "./api";

export async function getStoreReviewsService(storeId) {
  const response = await api.get(`/api/store-reviews/store/${storeId}`);
  return response.data;
}

export async function checkStoreReviewPermissionService(storeId, jobPostId) {
  const response = await api.get(
    `/api/store-reviews/store/${storeId}/job-post/${jobPostId}/permission`
  );
  return response.data;
}

export async function createStoreReviewService({ storeId, employmentRecordId, rating, comment }) {
  const response = await api.post(
    `/api/store-reviews?storeId=${storeId}&employmentRecordId=${employmentRecordId}`,
    { rating, comment }
  );
  return response.data;
}
