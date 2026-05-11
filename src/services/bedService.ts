import api from "./api";

export const getBedsByRoom = async (roomId: any): Promise<any> => {
  return api.get(`/api/rooms/${roomId}/beds`);
};

export const addBed = async (roomId: any, data: any): Promise<any> => {
  return api.post(`/api/rooms/${roomId}/beds`, data);
};

export const updateBed = async (id: any, data: any): Promise<any> => {
  return api.put(`/api/beds/${id}`, data);
};

export const deleteBed = async (id: any): Promise<any> => {
  return api.delete(`/api/beds/${id}`);
};
