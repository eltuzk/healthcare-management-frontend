import api from "./api";

export const getDoctorMe = async (): Promise<any> => {
  return api.get("/api/doctors/me");
};
