"use server";

import { db } from "@/server/db";
import type { Product, Purchase, Sale } from "@prisma/client";
import type { DashboardKPIs, ProductWithStats, ProfitByProduct } from "@/types";

export async function getDashboardKPIs(): Promise<DashboardKPIs> {
  const [purchaseAgg, saleAgg, productCount, receiptCount] = await Promise.all([
    db.purchase.aggregate({
      _sum: { total: true },
    }),
    db.sale.aggregate({
      where: { isSold: true },
      _sum: { totalRevenue: true, totalCost: true, grossProfit: true, quantity: true },
    }),
    db.product.count(),
    db.purchase.findMany({ distinct: ["receiptNum"], where: { receiptNum: { not: null } } }),
  ]);

  const totalInvested = Number(purchaseAgg._sum.total ?? 0);
  const totalRevenue = Number(saleAgg._sum.totalRevenue ?? 0);
  const totalCost = Number(saleAgg._sum.totalCost ?? 0);
  const netProfit = totalRevenue - totalCost;
  const roi = totalInvested > 0 ? (netProfit / totalInvested) * 100 : 0;

  const purchases: Purchase[] = await db.purchase.findMany();
  const sales: Sale[] = await db.sale.findMany({ where: { isSold: true } });

  const purchasedQty = new Map<number, number>();
  for (const p of purchases) {
    purchasedQty.set(p.productId, (purchasedQty.get(p.productId) ?? 0) + p.quantity);
  }
  const soldQty = new Map<number, number>();
  for (const s of sales) {
    soldQty.set(s.productId, (soldQty.get(s.productId) ?? 0) + s.quantity);
  }

  let totalStock = 0;
  for (const [pid, bought] of purchasedQty) {
    totalStock += bought - (soldQty.get(pid) ?? 0);
  }

  return {
    totalInvested,
    totalRevenue,
    netProfit,
    roi,
    totalStock,
    totalSold: Number(saleAgg._sum.quantity ?? 0),
    totalProducts: productCount,
    totalReceipts: receiptCount.length,
  };
}

export async function getProductsWithStats(): Promise<ProductWithStats[]> {
  const products: Product[] = await db.product.findMany({ orderBy: { name: "asc" } });
  const purchases: Purchase[] = await db.purchase.findMany();
  const sales: Sale[] = await db.sale.findMany({ where: { isSold: true } });

  const purchaseMap = new Map<number, number>();
  for (const p of purchases) {
    purchaseMap.set(p.productId, (purchaseMap.get(p.productId) ?? 0) + p.quantity);
  }
  const salesMap = new Map<number, number>();
  for (const s of sales) {
    salesMap.set(s.productId, (salesMap.get(s.productId) ?? 0) + s.quantity);
  }

  return products.map((product: Product) => {
    const purchased = purchaseMap.get(product.id) ?? 0;
    const sold = salesMap.get(product.id) ?? 0;
    return {
      ...product,
      purchased,
      sold,
      stock: purchased - sold,
    };
  });
}

export async function getProfitByProduct(): Promise<ProfitByProduct[]> {
  const sales = await db.sale.findMany({
    where: { isSold: true },
    include: { product: true },
  }) as (Sale & { product: Product })[];

  const map = new Map<number, ProfitByProduct>();

  for (const sale of sales) {
    const existing = map.get(sale.productId);
    const revenue = Number(sale.totalRevenue);
    const cost = Number(sale.totalCost);
    const profit = Number(sale.grossProfit);

    if (existing) {
      existing.unitsSold += sale.quantity;
      existing.totalRevenue += revenue;
      existing.totalCost += cost;
      existing.grossProfit += profit;
    } else {
      map.set(sale.productId, {
        productId: sale.productId,
        productName: sale.product.name,
        unitsSold: sale.quantity,
        totalRevenue: revenue,
        totalCost: cost,
        grossProfit: profit,
        marginPct: 0,
      });
    }
  }

  const results = Array.from(map.values());
  for (const r of results) {
    r.marginPct = r.totalRevenue > 0 ? (r.grossProfit / r.totalRevenue) * 100 : 0;
  }

  return results.sort((a, b) => b.grossProfit - a.grossProfit);
}

export async function getTopProductsByInvestment(): Promise<
  { productName: string; totalInvested: number }[]
> {
  const purchases: Purchase[] = await db.purchase.findMany();
  const products: Product[] = await db.product.findMany();

  const investmentMap = new Map<number, number>();
  for (const p of purchases) {
    investmentMap.set(p.productId, (investmentMap.get(p.productId) ?? 0) + Number(p.total));
  }

  const productMap = new Map<number, string>(products.map((p: Product) => [p.id, p.name]));

  const sorted = Array.from(investmentMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return sorted.map(([pid, total]) => ({
    productName: productMap.get(pid) ?? "Desconocido",
    totalInvested: total,
  }));
}
