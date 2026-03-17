import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { config } from "dotenv";

config({ path: ".env.local" });
config();

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const db = new PrismaClient({ adapter });

// Excel serial date to JS Date
function excelDate(serial: number): Date {
  return new Date((serial - 25569) * 86400000);
}

async function main() {
  console.log("Cleaning database...");
  await db.sale.deleteMany();
  await db.purchase.deleteMany();
  await db.product.deleteMany();

  console.log("Seeding database with Excel data...");

  // Products from Precios sheet (21 products)
  // Gender parsed from product name, type from name
  const products = [
    { name: "QAED AL FURSAN EDP 90ML HOMBRE", size: "90ml", gender: "HOMBRE" as const, type: "EDP" as const, cost: 11900, marginPct: 0.30 },
    { name: "ECLAIR EDP 35ML MUJER", size: "35ml", gender: "MUJER" as const, type: "EDP" as const, cost: 3900, marginPct: 0.60 },
    { name: "RAVE NOW EDP 100ML UNISEX", size: "100ml", gender: "UNISEX" as const, type: "EDP" as const, cost: 13900, marginPct: 0 },
    { name: "HAWAS FOR HIM EDP 100ML HOMBRE", size: "100ml", gender: "HOMBRE" as const, type: "EDP" as const, cost: 21900, marginPct: 0 },
    { name: "AQUATICA EDP 100ML HOMBRE", size: "100ml", gender: "HOMBRE" as const, type: "EDP" as const, cost: 25900, marginPct: 0 },
    { name: "MAS EDP 100ML UNISEX", size: "100ml", gender: "UNISEX" as const, type: "EDP" as const, cost: 29900, marginPct: 0 },
    { name: "VULCAN FEU EDP 100ML UNISEX", size: "100ml", gender: "UNISEX" as const, type: "EDP" as const, cost: 32900, marginPct: 0 },
    { name: "ASAD ELIXIR EDP 100ML HOMBRE", size: "100ml", gender: "HOMBRE" as const, type: "EDP" as const, cost: 23900, marginPct: 0 },
    { name: "HAYAATI EDP 100ML HOMBRE", size: "100ml", gender: "HOMBRE" as const, type: "EDP" as const, cost: 11900, marginPct: 0 },
    { name: "MANDARIN SKY EDP 100ML HOMBRE", size: "100ml", gender: "HOMBRE" as const, type: "EDP" as const, cost: 25900, marginPct: 0 },
    { name: "LIQUID BRUN EDP 100ML UNISEX", size: "100ml", gender: "UNISEX" as const, type: "EDP" as const, cost: 24900, marginPct: 0 },
    { name: "HAWAS ICE EDP 100ML HOMBRE", size: "100ml", gender: "HOMBRE" as const, type: "EDP" as const, cost: 26900, marginPct: 0 },
    { name: "ASAD EDP 30ML HOMBRE", size: "30ml", gender: "HOMBRE" as const, type: "EDP" as const, cost: 2900, marginPct: 0 },
    { name: "OUD FOR GLORY WHITE EDP 30ML UNISEX", size: "30ml", gender: "UNISEX" as const, type: "EDP" as const, cost: 2900, marginPct: 0 },
    { name: "SCANDAL EDP 25ML HOMBRE", size: "25ml", gender: "HOMBRE" as const, type: "EDP" as const, cost: 2900, marginPct: 0 },
    { name: "SCANDAL WOMEN EDP 30ML MUJER", size: "30ml", gender: "MUJER" as const, type: "EDP" as const, cost: 5800, marginPct: 0 },
    { name: "SARA CANDY EDP 30ML MUJER", size: "30ml", gender: "MUJER" as const, type: "EDP" as const, cost: 2900, marginPct: 0 },
    { name: "KAMRAH EDP 30ML HOMBRE", size: "30ml", gender: "HOMBRE" as const, type: "EDP" as const, cost: 2900, marginPct: 0 },
    { name: "NOW PINK EDP 30ML MUJER", size: "30ml", gender: "MUJER" as const, type: "EDP" as const, cost: 2900, marginPct: 0 },
    { name: "HAYAATI BODY MIST 250ML HOMBRE", size: "250ml", gender: "HOMBRE" as const, type: "BODY_MIST" as const, cost: 3900, marginPct: 0 },
    { name: "MUESTRA 5ML UNISEX", size: "5ml", gender: "UNISEX" as const, type: "MUESTRA" as const, cost: 22000, marginPct: 0 },
  ];

  const createdProducts = [];
  for (const p of products) {
    const salePrice = p.marginPct > 0 ? Math.round(p.cost / (1 - p.marginPct)) : 0;
    const product = await db.product.create({
      data: {
        name: p.name,
        size: p.size,
        gender: p.gender,
        type: p.type,
        cost: p.cost,
        marginPct: p.marginPct,
        salePrice,
      },
    });
    createdProducts.push(product);
  }
  console.log(`Created ${createdProducts.length} products`);

  // Purchases from Gastos sheet (21 purchases, 3 receipts)
  // Excel date 45717 = 2025-02-14, 45721 = 2025-02-18, 45726 = 2025-02-23
  const purchases = [
    // Recibo #21395 (date serial 45717)
    { productIdx: 0, date: excelDate(45717), qty: 1, unitPrice: 11900, receipt: "21395" },
    { productIdx: 1, date: excelDate(45717), qty: 1, unitPrice: 3900, receipt: "21395" },
    { productIdx: 2, date: excelDate(45717), qty: 1, unitPrice: 13900, receipt: "21395" },
    { productIdx: 3, date: excelDate(45717), qty: 1, unitPrice: 21900, receipt: "21395" },
    { productIdx: 4, date: excelDate(45717), qty: 1, unitPrice: 25900, receipt: "21395" },
    { productIdx: 5, date: excelDate(45717), qty: 1, unitPrice: 29900, receipt: "21395" },
    { productIdx: 6, date: excelDate(45717), qty: 1, unitPrice: 32900, receipt: "21395" },
    { productIdx: 7, date: excelDate(45717), qty: 1, unitPrice: 23900, receipt: "21395" },
    { productIdx: 8, date: excelDate(45717), qty: 1, unitPrice: 11900, receipt: "21395" },
    { productIdx: 9, date: excelDate(45717), qty: 1, unitPrice: 25900, receipt: "21395" },
    { productIdx: 10, date: excelDate(45717), qty: 1, unitPrice: 24900, receipt: "21395" },
    { productIdx: 11, date: excelDate(45717), qty: 1, unitPrice: 26900, receipt: "21395" },
    // Recibo #21398 (date serial 45721)
    { productIdx: 12, date: excelDate(45721), qty: 1, unitPrice: 2900, receipt: "21398" },
    { productIdx: 13, date: excelDate(45721), qty: 1, unitPrice: 2900, receipt: "21398" },
    { productIdx: 14, date: excelDate(45721), qty: 1, unitPrice: 2900, receipt: "21398" },
    { productIdx: 15, date: excelDate(45721), qty: 1, unitPrice: 5800, receipt: "21398" },
    { productIdx: 16, date: excelDate(45721), qty: 1, unitPrice: 2900, receipt: "21398" },
    { productIdx: 17, date: excelDate(45721), qty: 1, unitPrice: 2900, receipt: "21398" },
    { productIdx: 18, date: excelDate(45721), qty: 1, unitPrice: 2900, receipt: "21398" },
    { productIdx: 19, date: excelDate(45721), qty: 1, unitPrice: 3900, receipt: "21398" },
    // Recibo #21402 (date serial 45726)
    { productIdx: 20, date: excelDate(45726), qty: 1, unitPrice: 22000, receipt: "21402" },
  ];

  let totalInvested = 0;
  for (const p of purchases) {
    const total = p.qty * p.unitPrice;
    totalInvested += total;
    await db.purchase.create({
      data: {
        productId: createdProducts[p.productIdx].id,
        date: p.date,
        quantity: p.qty,
        unitPrice: p.unitPrice,
        total,
        receiptNum: p.receipt,
      },
    });
  }
  console.log(`Created ${purchases.length} purchases (Total: $${totalInvested.toLocaleString()})`);

  // Sales from Ventas sheet (21 sales, all is_sold=false)
  // Only 2 products have sale prices defined, rest have 0
  for (let i = 0; i < createdProducts.length; i++) {
    const product = createdProducts[i];
    const salePrice = Number(product.salePrice);
    const cost = Number(product.cost);
    const totalRevenue = salePrice * 1;
    const totalCost = cost * 1;
    const grossProfit = totalRevenue - totalCost;

    await db.sale.create({
      data: {
        productId: product.id,
        date: purchases.find((p) => p.productIdx === i)?.date ?? new Date(),
        quantity: 1,
        salePrice,
        totalRevenue,
        totalCost,
        grossProfit,
        isSold: false,
      },
    });
  }
  console.log(`Created ${createdProducts.length} sales (all pending)`);

  console.log(`\nSeed complete! Total invested: $${totalInvested.toLocaleString()}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
