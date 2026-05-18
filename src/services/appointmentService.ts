import api from "./api";

export const getAppointments = async (params?: {
  patientId?: any;
  doctorId?: any;
  doctorScheduleId?: any;
  status?: string;
}): Promise<any> => {
  return api.get("/api/appointments", { params });
};

export const getAppointmentById = async (id: any): Promise<any> => {
  return api.get(`/api/appointments/${id}`);
};

export const createAppointment = async (data: any): Promise<any> => {
  return api.post("/api/appointments", data);
};

export const createWalkInAppointment = async (data: any): Promise<any> => {
  return api.post("/api/appointments/walk-in", data);
};

export const checkInAppointment = async (id: any): Promise<any> => {
  return api.post(`/api/appointments/${id}/check-in`);
};

export const startAppointment = async (id: any): Promise<any> => {
  return api.post(`/api/appointments/${id}/start`);
};

export const cancelAppointment = async (id: any): Promise<any> => {
  return api.post(`/api/appointments/${id}/cancel`);
};
