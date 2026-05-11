import api from "./api";

export const getBranches = async (): Promise<any> => {
  return api.get("/api/branches");
};

export const getBranchById = async (id: any): Promise<any> => {
  return api.get(`/api/branches/${id}`);
};

export const createBranch = async (data: any): Promise<any> => {
  return api.post("/api/branches", data);
};

export const updateBranch = async (id: any, data: any): Promise<any> => {
  return api.put(`/api/branches/${id}`, data);
};

export const deleteBranch = async (id: any): Promise<any> => {
  return api.delete(`/api/branches/${id}`);
};

export const createSpecialty = async (data: any): Promise<any> => {
  return api.post("/api/specialties", data);
};

export const getSpecialties = async (): Promise<any> => {
  return api.get("/api/specialties");
};

export const getSpecialtyById = async (id: any): Promise<any> => {
  return api.get(`/api/specialties/${id}`);
};

export const updateSpecialty = async (id: any, data: any): Promise<any> => {
  return api.put(`/api/specialties/${id}`, data);
};

export const deactivateSpecialty = async (id: any): Promise<any> => {
  return api.patch(`/api/specialties/${id}/deactivate`);
};

export const createConsultationFee = async (data: any): Promise<any> => {
  return api.post("/api/consultation-fees", data);
};

export const getConsultationFees = async (): Promise<any> => {
  return api.get("/api/consultation-fees");
};

export const getConsultationFeeById = async (id: any): Promise<any> => {
  return api.get(`/api/consultation-fees/${id}`);
};

export const updateConsultationFee = async (
  id: any,
  data: any,
): Promise<any> => {
  return api.put(`/api/consultation-fees/${id}`, data);
};

export const deactivateConsultationFee = async (id: any): Promise<any> => {
  return api.patch(`/api/consultation-fees/${id}/deactivate`);
};
