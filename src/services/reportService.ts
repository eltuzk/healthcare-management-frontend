import api from "./api";

export interface RevenueBreakdown {
  key: string;
  totalAmount: number;
  transactionCount: number;
}

export interface RevenueReport {
  fromDate: string;
  toDate: string;
  totalRevenue: number;
  transactionCount: number;
  revenueByDate: RevenueBreakdown[];
  revenueByGateway: RevenueBreakdown[];
  revenueByOwnerType: RevenueBreakdown[];
}

export const getRevenueReport = async (params?: {
  fromDate?: string;
  toDate?: string;
  gateway?: string;
  ownerType?: string;
}): Promise<RevenueReport> => {
  return api.get("/api/reports/revenue", { params });
};
