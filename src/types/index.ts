export type { Product, Purchase, Sale } from "@/server/db";

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export type ProductWithStats = {
  id: number;
  name: string;
  size: string | null;
  gender: string;
  type: string;
  cost: unknown;
  marginPct: unknown;
  salePrice: unknown;
  createdAt: Date;
  updatedAt: Date;
  purchased: number;
  sold: number;
  stock: number;
};

export type ProfitByProduct = {
  productId: number;
  productName: string;
  unitsSold: number;
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  marginPct: number;
};

export type DashboardKPIs = {
  totalInvested: number;
  totalRevenue: number;
  netProfit: number;
  roi: number;
  totalStock: number;
  totalSold: number;
  totalProducts: number;
  totalReceipts: number;
};
