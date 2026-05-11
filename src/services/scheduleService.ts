import api from "./api";

export const createDoctorSchedule = async (data: any): Promise<any> => {
  return api.post("/api/doctor-schedules", data);
};

export const importDoctorSchedules = async (file: any): Promise<any> => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/api/doctor-schedules/import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getDoctorSchedules = async (params?: any): Promise<any> => {
  return api.get("/api/doctor-schedules", { params });
};

export const getDoctorScheduleById = async (id: any): Promise<any> => {
  return api.get(`/api/doctor-schedules/${id}`);
};

export const updateDoctorSchedule = async (
  id: any,
  data: any,
): Promise<any> => {
  return api.put(`/api/doctor-schedules/${id}`, data);
};

export const deleteDoctorSchedule = async (id: any): Promise<any> => {
  return api.delete(`/api/doctor-schedules/${id}`);
};

export const createAppointment = async (data: any): Promise<any> => {
  return api.post("/api/appointments", data);
};

export const createWalkInAppointment = async (data: any): Promise<any> => {
  return api.post("/api/appointments/walk-in", data);
};

export const getAppointmentById = async (id: any): Promise<any> => {
  return api.get(`/api/appointments/${id}`);
};

export const getAppointments = async (params?: any): Promise<any> => {
  return api.get("/api/appointments", { params });
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

export const handleSepayWebhook = async (
  data: any,
  secretKey: string,
): Promise<any> => {
  return api.post("/api/appointments/sepay/webhook", data, {
    headers: { "X-Secret-Key": secretKey },
  });
};
