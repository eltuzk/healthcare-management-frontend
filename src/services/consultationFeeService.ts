import api from "./api";

export const getConsultationFees = async (): Promise<any> => {
  return api.get("/api/consultation-fees");
};

export const getConsultationFeeById = async (id: any): Promise<any> => {
  return api.get(`/api/consultation-fees/${id}`);
};
