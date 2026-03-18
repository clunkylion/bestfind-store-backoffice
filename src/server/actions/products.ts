"use server";

import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { db } from "@/server/db";
import { productSchema } from "@/lib/validators";
import { handleServerError } from "@/lib/error-handler";
import { serialize } from "@/lib/utils";
import type { ActionResult, Product } from "@/types";

export async function getProducts() {
  noStore();
  const products = await db.product.findMany({ orderBy: { name: "asc" } });
  return serialize(products);
}

export async function createProduct(
  formData: FormData
): Promise<ActionResult<Product>> {
  try {
    const parsed = productSchema.parse(Object.fromEntries(formData));
    const salePrice = parsed.cost / (1 - parsed.marginPct);

    const product = await db.product.create({
      data: {
        name: parsed.name,
        size: parsed.size || null,
        gender: parsed.gender,
        type: parsed.type,
        cost: parsed.cost,
        marginPct: parsed.marginPct,
        salePrice: Math.round(salePrice),
      },
    });

    revalidatePath("/productos");
    revalidatePath("/");
    return { success: true, data: serialize(product) };
  } catch (error) {
    return handleServerError(error, { action: "createProduct", entity: "product" });
  }
}

export async function updateProduct(
  id: number,
  formData: FormData
): Promise<ActionResult<Product>> {
  try {
    const parsed = productSchema.parse(Object.fromEntries(formData));
    const salePrice = parsed.cost / (1 - parsed.marginPct);

    const product = await db.product.update({
      where: { id },
      data: {
        name: parsed.name,
        size: parsed.size || null,
        gender: parsed.gender,
        type: parsed.type,
        cost: parsed.cost,
        marginPct: parsed.marginPct,
        salePrice: Math.round(salePrice),
      },
    });

    revalidatePath("/productos");
    revalidatePath("/");
    return { success: true, data: serialize(product) };
  } catch (error) {
    return handleServerError(error, { action: "updateProduct", entity: "product" });
  }
}

export async function deleteProduct(id: number): Promise<ActionResult> {
  try {
    await db.product.delete({ where: { id } });
    revalidatePath("/productos");
    revalidatePath("/");
    return { success: true, data: undefined };
  } catch (error) {
    return handleServerError(error, { action: "deleteProduct", entity: "product" });
  }
}
