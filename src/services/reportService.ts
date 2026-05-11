import api from "./api";

export const getRevenueReport = async (params?: {
  fromDate?: string;
  toDate?: string;
  gateway?: string;
  ownerType?: string;
}): Promise<any> => {
  return api.get("/api/reports/revenue", { params });
};
