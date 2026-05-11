import api from "./api";

export const getLabTests = async (): Promise<any> => {
  return api.get("/api/lab-tests");
};

export const getLabTestById = async (id: any): Promise<any> => {
  return api.get(`/api/lab-tests/${id}`);
};

export const createLabTest = async (data: any): Promise<any> => {
  return api.post("/api/lab-tests", data);
};

export const updateLabTest = async (id: any, data: any): Promise<any> => {
  return api.put(`/api/lab-tests/${id}`, data);
};

export const deactivateLabTest = async (id: any): Promise<any> => {
  return api.patch(`/api/lab-tests/${id}/deactivate`);
};

export const createLabTestRequest = async (data: any): Promise<any> => {
  return api.post("/api/lab-test-requests", data);
};

export const getLabTestRequests = async (
  params: any = {},
  page = 0,
  size = 10,
): Promise<any> => {
  return api.get("/api/lab-test-requests", {
    params: { ...params, page, size },
  });
};

export const getLabTestRequestById = async (id: any): Promise<any> => {
  return api.get(`/api/lab-test-requests/${id}`);
};

export const updateLabTestRequestStatus = async (
  id: any,
  data: any,
): Promise<any> => {
  return api.put(`/api/lab-test-requests/${id}/status`, data);
};

export const getLabTestRequestsByMedicalRecordId = async (
  medRecordId: any,
): Promise<any> => {
  return api.get(`/api/lab-test-requests/medical-record/${medRecordId}`);
};

export const createLabTestResult = async (
  requestId: any,
  data: any,
): Promise<any> => {
  return api.post(`/api/lab-test-requests/${requestId}/results`, data);
};

export const getLabTestResultByRequestId = async (
  requestId: any,
): Promise<any> => {
  return api.get(`/api/lab-test-requests/${requestId}/results`);
};

export const updateLabTestResult = async (id: any, data: any): Promise<any> => {
  return api.put(`/api/lab-test-results/${id}`, data);
};
