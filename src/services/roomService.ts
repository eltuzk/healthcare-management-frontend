import api from "./api";

// Room Type APIs
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

// Room APIs
export const getRooms = async (roomTypeId?: any): Promise<any> => {
  return api.get("/api/rooms", { params: { roomTypeId } });
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
