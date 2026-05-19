import api from "./api";

export const getLabTests = async (params?: any): Promise<any> => {
  return api.get("/api/lab-tests", { params });
};

export const createLabTestRequest = async (data: any): Promise<any> => {
  return api.post("/api/lab-test-requests", data);
};

export const getLabTestRequestsByMedicalRecord = async (medRecordId: any): Promise<any> => {
  return api.get(`/api/lab-test-requests/medical-record/${medRecordId}`);
};
