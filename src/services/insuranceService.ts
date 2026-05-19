import api from "./api";

export const getInsurancesByPatientId = async (patientId: any): Promise<any> => {
  return api.get(`/api/patient-insurances/patient/${patientId}`);
};

export const createInsurance = async (data: any): Promise<any> => {
  return api.post("/api/patient-insurances", data);
};

export const updateInsurance = async (id: any, data: any): Promise<any> => {
  return api.put(`/api/patient-insurances/${id}`, data);
};

export const deleteInsurance = async (id: any): Promise<any> => {
  return api.delete(`/api/patient-insurances/${id}`);
};
