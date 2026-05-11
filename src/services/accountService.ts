import api from "./api";

export const getAccounts = async (page = 0, size = 10): Promise<any> => {
  return api.get("/api/accounts", { params: { page, size } });
};

export const getAccountById = async (id: any): Promise<any> => {
  return api.get(`/api/accounts/${id}`);
};

export const createAccount = async (data: any): Promise<any> => {
  return api.post("/api/accounts", data);
};

export const updateAccount = async (id: any, data: any): Promise<any> => {
  return api.put(`/api/accounts/${id}`, data);
};

export const deleteAccount = async (id: any): Promise<any> => {
  return api.delete(`/api/accounts/${id}`);
};

export const getMyAccount = async (): Promise<any> => {
  return api.get("/api/accounts/me");
};

export const createAccountPermission = async (data: any): Promise<any> => {
  return api.post("/api/account-permissions", data);
};

export const deleteAccountPermission = async (data: any): Promise<any> => {
  return api.delete("/api/account-permissions", { data });
};

export const getAccountPermissionsByAccountId = async (
  accountId: any,
): Promise<any> => {
  return api.get(`/api/account-permissions/account/${accountId}`);
};
