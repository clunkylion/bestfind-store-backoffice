"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { saleSchema } from "@/lib/validators";
import { handleServerError } from "@/lib/error-handler";
import type { ActionResult, Sale } from "@/types";

export async function getSales(): Promise<Sale[]> {
  return db.sale.findMany({
    orderBy: { date: "desc" },
    include: { product: true },
  });
}

export async function createSale(
  formData: FormData
): Promise<ActionResult<Sale>> {
  try {
    const parsed = saleSchema.parse(Object.fromEntries(formData));

    const product = await db.product.findUniqueOrThrow({
      where: { id: parsed.productId },
    });

    const totalRevenue = parsed.quantity * parsed.salePrice;
    const totalCost = parsed.quantity * Number(product.cost);
    const grossProfit = totalRevenue - totalCost;

    const sale = await db.sale.create({
      data: {
        productId: parsed.productId,
        date: parsed.date,
        quantity: parsed.quantity,
        salePrice: parsed.salePrice,
        totalRevenue,
        totalCost,
        grossProfit,
        isSold: false,
        notes: parsed.notes || null,
      },
    });

    revalidatePath("/ventas");
    revalidatePath("/");
    revalidatePath("/ganancias");
    return { success: true, data: sale };
  } catch (error) {
    return handleServerError(error, { action: "createSale", entity: "sale" });
  }
}

export async function updateSale(
  id: number,
  formData: FormData
): Promise<ActionResult<Sale>> {
  try {
    const parsed = saleSchema.parse(Object.fromEntries(formData));

    const product = await db.product.findUniqueOrThrow({
      where: { id: parsed.productId },
    });

    const totalRevenue = parsed.quantity * parsed.salePrice;
    const totalCost = parsed.quantity * Number(product.cost);
    const grossProfit = totalRevenue - totalCost;

    const sale = await db.sale.update({
      where: { id },
      data: {
        productId: parsed.productId,
        date: parsed.date,
        quantity: parsed.quantity,
        salePrice: parsed.salePrice,
        totalRevenue,
        totalCost,
        grossProfit,
        notes: parsed.notes || null,
      },
    });

    revalidatePath("/ventas");
    revalidatePath("/");
    revalidatePath("/ganancias");
    return { success: true, data: sale };
  } catch (error) {
    return handleServerError(error, { action: "updateSale", entity: "sale" });
  }
}

export async function toggleSoldStatus(id: number): Promise<ActionResult<Sale>> {
  try {
    const sale = await db.sale.findUniqueOrThrow({ where: { id } });
    const updated = await db.sale.update({
      where: { id },
      data: { isSold: !sale.isSold },
    });

    revalidatePath("/ventas");
    revalidatePath("/");
    revalidatePath("/ganancias");
    return { success: true, data: updated };
  } catch (error) {
    return handleServerError(error, { action: "toggleSoldStatus", entity: "sale" });
  }
}

export async function deleteSale(id: number): Promise<ActionResult> {
  try {
    await db.sale.delete({ where: { id } });
    revalidatePath("/ventas");
    revalidatePath("/");
    revalidatePath("/ganancias");
    return { success: true, data: undefined };
  } catch (error) {
    return handleServerError(error, { action: "deleteSale", entity: "sale" });
  }
}
