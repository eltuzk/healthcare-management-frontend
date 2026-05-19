import api from "./api";

export const getMedicines = async (): Promise<any> => {
  return api.get("/api/medicines");
};

export const getMedicineLots = async (medicineId?: number): Promise<any> => {
  return api.get("/api/medicine-lots", {
    params: medicineId ? { medicineId } : {}
  });
};

export const createPrescription = async (data: any): Promise<any> => {
  return api.post("/api/prescriptions", data);
};

export const getPrescriptions = async (): Promise<any> => {
  return api.get("/api/prescriptions");
};

export const getPrescriptionByMedicalRecordId = async (medicalRecordId: number): Promise<any> => {
  return api.get(`/api/prescriptions/medical-record/${medicalRecordId}`);
};
