import api from "./api";

export const getAdmissionRequests = async (): Promise<any> => {
  return api.get("/api/admission-requests");
};

export const getAdmissionRequestById = async (id: any): Promise<any> => {
  return api.get(`/api/admission-requests/${id}`);
};

export const getAdmissionsByPatientId = async (
  patientId: any,
): Promise<any> => {
  return api.get(`/api/patients/${patientId}/admissions`);
};

export const createAdmissionRequest = async (data: any): Promise<any> => {
  return api.post("/api/admission-requests", data);
};

export const updateAdmissionRequestStatus = async (
  id: any,
  data: any,
): Promise<any> => {
  return api.put(`/api/admission-requests/${id}/status`, data);
};

export const getAdmissionRecords = async (admissionId: any): Promise<any> => {
  return api.get(`/api/admission-requests/${admissionId}/records`);
};

export const createAdmissionRecord = async (
  admissionId: any,
  data: any,
): Promise<any> => {
  return api.post(`/api/admission-requests/${admissionId}/records`, data);
};

export const updateAdmissionRecord = async (
  id: any,
  data: any,
): Promise<any> => {
  return api.put(`/api/admission-records/${id}`, data);
};

export const getRooms = async (params?: any): Promise<any> => {
  return api.get("/api/rooms", { params });
};

export const getRoomById = async (id: any): Promise<any> => {
  return api.get(`/api/rooms/${id}`);
};

export const createRoom = async (data: any): Promise<any> => {
  return api.post("/api/rooms", data);
};

export const updateRoom = async (id: any, data: any): Promise<any> => {
  return api.put(`/api/rooms/${id}`, data);
};

export const deleteRoom = async (id: any): Promise<any> => {
  return api.delete(`/api/rooms/${id}`);
};

export const getRoomTypes = async (): Promise<any> => {
  return api.get("/api/room-types");
};

export const getRoomTypeById = async (id: any): Promise<any> => {
  return api.get(`/api/room-types/${id}`);
};

export const createRoomType = async (data: any): Promise<any> => {
  return api.post("/api/room-types", data);
};

export const updateRoomType = async (id: any, data: any): Promise<any> => {
  return api.put(`/api/room-types/${id}`, data);
};

export const deleteRoomType = async (id: any): Promise<any> => {
  return api.delete(`/api/room-types/${id}`);
};

export const getBedsByRoomId = async (roomId: any): Promise<any> => {
  return api.get(`/api/rooms/${roomId}/beds`);
};

export const createBed = async (roomId: any, data: any): Promise<any> => {
  return api.post(`/api/rooms/${roomId}/beds`, data);
};

export const updateBed = async (id: any, data: any): Promise<any> => {
  return api.put(`/api/beds/${id}`, data);
};

export const deleteBed = async (id: any): Promise<any> => {
  return api.delete(`/api/beds/${id}`);
};
