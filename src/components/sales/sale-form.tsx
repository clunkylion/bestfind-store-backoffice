"use client";

import { useActionState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createSale, updateSale } from "@/server/actions/sales";
import type { Product, Sale } from "@/types";
import { toast } from "sonner";
import { format } from "date-fns";

interface SaleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale?: (Sale & { product?: { name: string } }) | null;
  products: Product[];
}

export function SaleForm({ open, onOpenChange, sale, products }: SaleFormProps) {
  const isEdit = !!sale;

  async function action(_prev: unknown, formData: FormData) {
    const result = isEdit
      ? await updateSale(sale!.id, formData)
      : await createSale(formData);

    if (result.success) {
      toast.success(isEdit ? "Venta actualizada" : "Venta registrada");
      onOpenChange(false);
      return result;
    }
    toast.error(result.error);
    return result;
  }

  const [, formAction, pending] = useActionState(action, null);

  const selectedProduct = products.find(
    (p) => p.id === sale?.productId
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar Venta" : "Nueva Venta"}
          </DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="productId">Producto</Label>
            <Select
              name="productId"
              defaultValue={sale?.productId?.toString() ?? ""}
            >
              <SelectTrigger id="productId">
                <SelectValue placeholder="Seleccionar producto" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={
                  sale
                    ? format(new Date(sale.date), "yyyy-MM-dd")
                    : format(new Date(), "yyyy-MM-dd")
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Cantidad</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                defaultValue={sale?.quantity ?? 1}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="salePrice">Precio Venta</Label>
            <Input
              id="salePrice"
              name="salePrice"
              type="number"
              step="1"
              defaultValue={
                sale
                  ? Number(sale.salePrice)
                  : selectedProduct
                    ? Number(selectedProduct.salePrice)
                    : ""
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              name="notes"
              defaultValue={sale?.notes ?? ""}
              rows={2}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Guardando..." : isEdit ? "Actualizar" : "Registrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
