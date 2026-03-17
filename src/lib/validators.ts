import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  size: z.string().optional(),
  gender: z.enum(["HOMBRE", "MUJER", "UNISEX"]),
  type: z.enum(["EDP", "BODY_MIST", "MUESTRA"]),
  cost: z.coerce.number().positive("El costo debe ser positivo"),
  marginPct: z.coerce
    .number()
    .min(0, "El margen debe ser >= 0")
    .max(1, "El margen debe ser <= 1"),
});

export const purchaseSchema = z.object({
  productId: z.coerce.number().int().positive(),
  date: z.coerce.date(),
  quantity: z.coerce.number().int().positive("La cantidad debe ser positiva"),
  unitPrice: z.coerce.number().positive("El precio unitario debe ser positivo"),
  notes: z.string().optional(),
  receiptNum: z.string().optional(),
});

export const saleSchema = z.object({
  productId: z.coerce.number().int().positive(),
  date: z.coerce.date(),
  quantity: z.coerce.number().int().positive("La cantidad debe ser positiva"),
  salePrice: z.coerce.number().positive("El precio de venta debe ser positivo"),
  notes: z.string().optional(),
});
