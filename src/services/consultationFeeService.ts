import api from "./api";

export const getConsultationFees = async (): Promise<any> => {
  return api.get("/api/consultation-fees");
};

export const getConsultationFeeById = async (id: any): Promise<any> => {
  return api.get(`/api/consultation-fees/${id}`);
};

export const createConsultationFee = async (data: any): Promise<any> => {
  return api.post("/api/consultation-fees", data);
};

export const updateConsultationFee = async (id: any, data: any): Promise<any> => {
  return api.put(`/api/consultation-fees/${id}`, data);
};

export const deactivateConsultationFee = async (id: any): Promise<any> => {
  return api.patch(`/api/consultation-fees/${id}/deactivate`);
};
