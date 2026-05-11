import api from "./api";

export const getMedicalServices = async (): Promise<any> => {
  return api.get("/api/medical-services");
};

export const getMedicalServiceById = async (id: any): Promise<any> => {
  return api.get(`/api/medical-services/${id}`);
};

export const createMedicalService = async (data: any): Promise<any> => {
  return api.post("/api/medical-services", data);
};

export const updateMedicalService = async (
  id: any,
  data: any,
): Promise<any> => {
  return api.put(`/api/medical-services/${id}`, data);
};

export const deactivateMedicalService = async (id: any): Promise<any> => {
  return api.patch(`/api/medical-services/${id}/deactivate`);
};

export const createMedicalServiceRequest = async (data: any): Promise<any> => {
  return api.post("/api/medical-service-requests", data);
};

export const getMedicalServiceRequests = async (
  params: any = {},
  page = 0,
  size = 10,
): Promise<any> => {
  return api.get("/api/medical-service-requests", {
    params: { ...params, page, size },
  });
};

export const getMedicalServiceRequestById = async (id: any): Promise<any> => {
  return api.get(`/api/medical-service-requests/${id}`);
};

export const updateMedicalServiceRequestStatus = async (
  id: any,
  data: any,
): Promise<any> => {
  return api.put(`/api/medical-service-requests/${id}/status`, data);
};

export const updateMedicalServiceResultForRequest = async (
  requestId: any,
  data: any,
): Promise<any> => {
  return api.post(`/api/medical-service-requests/${requestId}/results`, data);
};

export const getMedicalServiceResultByRequestId = async (
  requestId: any,
): Promise<any> => {
  return api.get(`/api/medical-service-requests/${requestId}/results`);
};

export const updateMedicalServiceResultById = async (
  id: any,
  data: any,
): Promise<any> => {
  return api.put(`/api/medical-service-results/${id}`, data);
};
