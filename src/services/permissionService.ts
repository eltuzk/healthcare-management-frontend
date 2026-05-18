import api from "./api";

// Permission APIs
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

// Role APIs
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

// Role-Permission APIs
export const assignPermissionToRole = async (data: any): Promise<any> => {
  return api.post("/api/role-permissions", data);
};

export const revokePermissionFromRole = async (data: any): Promise<any> => {
  return api.delete("/api/role-permissions", { data });
};

export const getPermissionsByRoleId = async (roleId: any): Promise<any> => {
  return api.get(`/api/role-permissions/role/${roleId}`);
};
