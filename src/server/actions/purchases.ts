"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { purchaseSchema } from "@/lib/validators";
import { handleServerError } from "@/lib/error-handler";
import type { ActionResult, Purchase } from "@/types";

export async function getPurchases(): Promise<Purchase[]> {
  return db.purchase.findMany({
    orderBy: { date: "desc" },
    include: { product: true },
  });
}

export async function createPurchase(
  formData: FormData
): Promise<ActionResult<Purchase>> {
  try {
    const parsed = purchaseSchema.parse(Object.fromEntries(formData));
    const total = parsed.quantity * parsed.unitPrice;

    const purchase = await db.purchase.create({
      data: {
        productId: parsed.productId,
        date: parsed.date,
        quantity: parsed.quantity,
        unitPrice: parsed.unitPrice,
        total,
        notes: parsed.notes || null,
        receiptNum: parsed.receiptNum || null,
      },
    });

    revalidatePath("/compras");
    revalidatePath("/");
    return { success: true, data: purchase };
  } catch (error) {
    return handleServerError(error, { action: "createPurchase", entity: "purchase" });
  }
}

export async function updatePurchase(
  id: number,
  formData: FormData
): Promise<ActionResult<Purchase>> {
  try {
    const parsed = purchaseSchema.parse(Object.fromEntries(formData));
    const total = parsed.quantity * parsed.unitPrice;

    const purchase = await db.purchase.update({
      where: { id },
      data: {
        productId: parsed.productId,
        date: parsed.date,
        quantity: parsed.quantity,
        unitPrice: parsed.unitPrice,
        total,
        notes: parsed.notes || null,
        receiptNum: parsed.receiptNum || null,
      },
    });

    revalidatePath("/compras");
    revalidatePath("/");
    return { success: true, data: purchase };
  } catch (error) {
    return handleServerError(error, { action: "updatePurchase", entity: "purchase" });
  }
}

export async function deletePurchase(id: number): Promise<ActionResult> {
  try {
    await db.purchase.delete({ where: { id } });
    revalidatePath("/compras");
    revalidatePath("/");
    return { success: true, data: undefined };
  } catch (error) {
    return handleServerError(error, { action: "deletePurchase", entity: "purchase" });
  }
}
