"use server";

import { db } from "@/server/db";
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

  const stockResult = await db.$queryRaw<{ total_stock: bigint }[]>`
    SELECT COALESCE(SUM(p.quantity), 0) - COALESCE(SUM(s.quantity), 0) as total_stock
    FROM (
      SELECT product_id, SUM(quantity) as quantity FROM purchases GROUP BY product_id
    ) p
    LEFT JOIN (
      SELECT product_id, SUM(quantity) as quantity FROM sales WHERE is_sold = true GROUP BY product_id
    ) s ON p.product_id = s.product_id
  `;

  return {
    totalInvested,
    totalRevenue,
    netProfit,
    roi,
    totalStock: Number(stockResult[0]?.total_stock ?? 0),
    totalSold: Number(saleAgg._sum.quantity ?? 0),
    totalProducts: productCount,
    totalReceipts: receiptCount.length,
  };
}

export async function getProductsWithStats(): Promise<ProductWithStats[]> {
  const products = await db.product.findMany({ orderBy: { name: "asc" } });

  const purchasesByProduct = await db.purchase.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
  });

  const salesByProduct = await db.sale.groupBy({
    by: ["productId"],
    where: { isSold: true },
    _sum: { quantity: true },
  });

  const purchaseMap = new Map<number, number>(
    purchasesByProduct.map((p: { productId: number; _sum: { quantity: number | null } }) => [p.productId, Number(p._sum.quantity ?? 0)])
  );
  const salesMap = new Map<number, number>(
    salesByProduct.map((s: { productId: number; _sum: { quantity: number | null } }) => [s.productId, Number(s._sum.quantity ?? 0)])
  );

  return products.map((product) => {
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
  });

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
  const result = await db.purchase.groupBy({
    by: ["productId"],
    _sum: { total: true },
    orderBy: { _sum: { total: "desc" } },
    take: 5,
  });

  const productIds = result.map((r) => r.productId);
  const products = await db.product.findMany({
    where: { id: { in: productIds } },
  });

  const productMap = new Map(products.map((p) => [p.id, p.name]));

  return result.map((r) => ({
    productName: productMap.get(r.productId) ?? "Desconocido",
    totalInvested: Number(r._sum.total ?? 0),
  }));
}
