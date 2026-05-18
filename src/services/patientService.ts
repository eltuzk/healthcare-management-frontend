import api from "./api";

export const getPatients = async (page = 0, size = 10): Promise<any> => {
  return api.get("/api/patients", { params: { page, size } });
};

export const getPatientById = async (id: any): Promise<any> => {
  return api.get(`/api/patients/${id}`);
};

export const getMyPatient = async (): Promise<any> => {
  return api.get("/api/patients/me");
};

export const createPatient = async (data: any): Promise<any> => {
  return api.post("/api/patients", data);
};

export const updatePatient = async (id: any, data: any): Promise<any> => {
  return api.put(`/api/patients/${id}`, data);
};

export const deletePatient = async (id: any): Promise<any> => {
  return api.delete(`/api/patients/${id}`);
};

export const getPatientInsurancesByPatientId = async (
  patientId: any,
): Promise<any> => {
  return api.get(`/api/patient-insurances/patient/${patientId}`);
};

export const createPatientInsurance = async (data: any): Promise<any> => {
  return api.post("/api/patient-insurances", data);
};

export const updatePatientInsurance = async (
  id: any,
  data: any,
): Promise<any> => {
  return api.put(`/api/patient-insurances/${id}`, data);
};

export const deletePatientInsurance = async (id: any): Promise<any> => {
  return api.delete(`/api/patient-insurances/${id}`);
};

export const searchPatient = async (query: string): Promise<any> => {
  return api.get("/api/patients/search", { params: { query } });
};
