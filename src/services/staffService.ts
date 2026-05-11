import api from "./api";

export const getDoctors = async (page = 0, size = 10): Promise<any> => {
  return api.get("/api/doctors", { params: { page, size } });
};

export const getDoctorById = async (doctorId: any): Promise<any> => {
  return api.get(`/api/doctors/${doctorId}`);
};

export const createDoctor = async (data: any): Promise<any> => {
  return api.post("/api/doctors", data);
};

export const updateDoctor = async (doctorId: any, data: any): Promise<any> => {
  return api.put(`/api/doctors/${doctorId}`, data);
};

export const deleteDoctor = async (doctorId: any): Promise<any> => {
  return api.delete(`/api/doctors/${doctorId}`);
};

export const getRoles = async (): Promise<any> => {
  return api.get("/api/roles");
};

export const getRoleById = async (id: any): Promise<any> => {
  return api.get(`/api/roles/${id}`);
};

export const createRole = async (data: any): Promise<any> => {
  return api.post("/api/roles", data);
};

export const updateRole = async (id: any, data: any): Promise<any> => {
  return api.put(`/api/roles/${id}`, data);
};

export const deleteRole = async (id: any): Promise<any> => {
  return api.delete(`/api/roles/${id}`);
};

export const createRolePermission = async (data: any): Promise<any> => {
  return api.post("/api/role-permissions", data);
};

export const deleteRolePermission = async (data: any): Promise<any> => {
  return api.delete("/api/role-permissions", { data });
};

export const getRolePermissionsByRoleId = async (roleId: any): Promise<any> => {
  return api.get(`/api/role-permissions/role/${roleId}`);
};

export const getPermissions = async (): Promise<any> => {
  return api.get("/api/permissions");
};

export const getPermissionById = async (id: any): Promise<any> => {
  return api.get(`/api/permissions/${id}`);
};

export const createPermission = async (data: any): Promise<any> => {
  return api.post("/api/permissions", data);
};

export const updatePermission = async (id: any, data: any): Promise<any> => {
  return api.put(`/api/permissions/${id}`, data);
};

export const deletePermission = async (id: any): Promise<any> => {
  return api.delete(`/api/permissions/${id}`);
};
