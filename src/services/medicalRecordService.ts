import api from "./api";

export const createMedicalRecordFromAppointment = async (
  appointmentId: any,
  data: any,
): Promise<any> => {
  return api.post(
    `/api/medical-records/from-appointment/${appointmentId}`,
    data,
  );
};

export const getMedicalRecordById = async (id: any): Promise<any> => {
  return api.get(`/api/medical-records/${id}`);
};

export const getMedicalRecords = async (params?: any): Promise<any> => {
  return api.get("/api/medical-records", { params });
};

export const updateMedicalRecord = async (id: any, data: any): Promise<any> => {
  return api.put(`/api/medical-records/${id}`, data);
};

export const completeMedicalRecord = async (id: any): Promise<any> => {
  return api.post(`/api/medical-records/${id}/complete`);
};

export const lockMedicalRecord = async (id: any): Promise<any> => {
  return api.post(`/api/medical-records/${id}/lock`);
};
