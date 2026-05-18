import api from "./api";

export const getSpecialties = async (): Promise<any> => {
  return api.get("/api/specialties");
};

export const getSpecialtyById = async (id: any): Promise<any> => {
  return api.get(`/api/specialties/${id}`);
};

export const createSpecialty = async (data: any): Promise<any> => {
  return api.post("/api/specialties", data);
};

export const updateSpecialty = async (id: any, data: any): Promise<any> => {
  return api.put(`/api/specialties/${id}`, data);
};

export const deactivateSpecialty = async (id: any): Promise<any> => {
  return api.patch(`/api/specialties/${id}/deactivate`);
};
