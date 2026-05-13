import api from "./api";

export const getDoctorMe = async (): Promise<any> => {
  return api.get("/api/doctors/me");
};

export const updateDoctorMe = async (data: any): Promise<any> => {
  return api.put("/api/doctors/me", data);
};

export const getPatientMe = async (): Promise<any> => {
  return api.get("/api/patients/me");
};

export const updatePatientMe = async (data: any): Promise<any> => {
  return api.put("/api/patients/me", data);
};

export const getReceptionistMe = async (): Promise<any> => {
  return api.get("/api/receptionists/me");
};

export const updateReceptionistMe = async (data: any): Promise<any> => {
  return api.put("/api/receptionists/me", data);
};

export const getAccountantMe = async (): Promise<any> => {
  return api.get("/api/accountants/me");
};

export const updateAccountantMe = async (data: any): Promise<any> => {
  return api.put("/api/accountants/me", data);
};

export const getTechnicianMe = async (): Promise<any> => {
  return api.get("/api/technicians/me");
};

export const updateTechnicianMe = async (data: any): Promise<any> => {
  return api.put("/api/technicians/me", data);
};

export const getPharmacistMe = async (): Promise<any> => {
  return api.get("/api/pharmacists/me");
};

export const updatePharmacistMe = async (data: any): Promise<any> => {
  return api.put("/api/pharmacists/me", data);
};

export const getAdministratorMe = async (): Promise<any> => {
  return api.get("/api/administrators/me");
};

export const updateAdministratorMe = async (data: any): Promise<any> => {
  return api.put("/api/administrators/me", data);
};

export const getProfileByRole = async (role: string): Promise<any> => {
  const normalizedRole = role.startsWith('ROLE_') ? role : `ROLE_${role}`;
  switch (normalizedRole) {
    case "ROLE_DOCTOR":
      return getDoctorMe();
    case "ROLE_PATIENT":
      return getPatientMe();
    case "ROLE_RECEPTIONIST":
      return getReceptionistMe();
    case "ROLE_ACCOUNTANT":
      return getAccountantMe();
    case "ROLE_TECHNICIAN":
      return getTechnicianMe();
    case "ROLE_PHARMACIST":
      return getPharmacistMe();
    case "ROLE_ADMIN":
      return getAdministratorMe();
    default:
      throw new Error(`Role not supported for profile: ${role}`);
  }
};

export const updateProfileByRole = async (role: string, data: any): Promise<any> => {
  const normalizedRole = role.startsWith('ROLE_') ? role : `ROLE_${role}`;
  switch (normalizedRole) {
    case "ROLE_DOCTOR":
      return updateDoctorMe(data);
    case "ROLE_PATIENT":
      return updatePatientMe(data);
    case "ROLE_RECEPTIONIST":
      return updateReceptionistMe(data);
    case "ROLE_ACCOUNTANT":
      return updateAccountantMe(data);
    case "ROLE_TECHNICIAN":
      return updateTechnicianMe(data);
    case "ROLE_PHARMACIST":
      return updatePharmacistMe(data);
    case "ROLE_ADMIN":
      return updateAdministratorMe(data);
    default:
      throw new Error(`Role not supported for profile update: ${role}`);
  }
};
