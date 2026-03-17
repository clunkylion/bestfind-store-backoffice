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
import { createPurchase, updatePurchase } from "@/server/actions/purchases";
import type { Product, Purchase } from "@/types";
import { toast } from "sonner";
import { format } from "date-fns";

interface PurchaseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchase?: (Purchase & { product?: { name: string } }) | null;
  products: Product[];
}

export function PurchaseForm({
  open,
  onOpenChange,
  purchase,
  products,
}: PurchaseFormProps) {
  const isEdit = !!purchase;

  async function action(_prev: unknown, formData: FormData) {
    const result = isEdit
      ? await updatePurchase(purchase!.id, formData)
      : await createPurchase(formData);

    if (result.success) {
      toast.success(isEdit ? "Compra actualizada" : "Compra registrada");
      onOpenChange(false);
      return result;
    }
    toast.error(result.error);
    return result;
  }

  const [, formAction, pending] = useActionState(action, null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar Compra" : "Nueva Compra"}
          </DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="productId">Producto</Label>
            <Select
              name="productId"
              defaultValue={purchase?.productId?.toString() ?? ""}
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
                  purchase
                    ? format(new Date(purchase.date), "yyyy-MM-dd")
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
                defaultValue={purchase?.quantity ?? 1}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unitPrice">Precio Unitario</Label>
              <Input
                id="unitPrice"
                name="unitPrice"
                type="number"
                step="1"
                defaultValue={purchase ? Number(purchase.unitPrice) : ""}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="receiptNum">N° Recibo</Label>
              <Input
                id="receiptNum"
                name="receiptNum"
                defaultValue={purchase?.receiptNum ?? ""}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              name="notes"
              defaultValue={purchase?.notes ?? ""}
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
