import api from "./api";

export const getPaymentRecords = async (params?: any): Promise<any> => {
  return api.get("/api/payment-records", { params });
};

export const getPaymentRecordById = async (id: any): Promise<any> => {
  return api.get(`/api/payment-records/${id}`);
};

export const recordMedicalRecordCashPayment = async (
  medicalRecordId: any,
  data: any,
): Promise<any> => {
  return api.post(
    `/api/payment-records/medical-records/${medicalRecordId}/cash`,
    data,
  );
};

export const getRevenueReport = async (params?: any): Promise<any> => {
  return api.get("/api/reports/revenue", { params });
};
