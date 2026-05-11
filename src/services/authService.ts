import api from "./api";

export const register = async (data: any): Promise<any> => {
  return api.post("/api/auth/register", data);
};

export const verifyRegisterEmail = async (token: string): Promise<any> => {
  return api.post("/api/auth/register/verification-email", null, {
    params: { token },
  });
};

export const login = async (data: any): Promise<any> => {
  return api.post("/api/auth/login", data);
};

export const forgotPassword = async (data: any): Promise<any> => {
  return api.post("/api/auth/forgot-password", data);
};

export const resetPassword = async (token: string, data: any): Promise<any> => {
  return api.post("/api/auth/reset-password", data, {
    params: { token },
  });
};

export const changePassword = async (data: any): Promise<any> => {
  return api.post("/api/auth/change-password", data);
};
