import type { Product, Purchase, Sale } from "@prisma/client";

export type { Product, Purchase, Sale };

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export type ProductWithStats = Product & {
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
