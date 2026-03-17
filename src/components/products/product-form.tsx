"use client";

import { useActionState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProduct, updateProduct } from "@/server/actions/products";
import type { Product } from "@/types";
import { toast } from "sonner";

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
}

export function ProductForm({ open, onOpenChange, product }: ProductFormProps) {
  const isEdit = !!product;

  async function action(_prev: unknown, formData: FormData) {
    const result = isEdit
      ? await updateProduct(product!.id, formData)
      : await createProduct(formData);

    if (result.success) {
      toast.success(isEdit ? "Producto actualizado" : "Producto creado");
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
            {isEdit ? "Editar Producto" : "Nuevo Producto"}
          </DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              defaultValue={product?.name ?? ""}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="size">Tamaño</Label>
              <Input
                id="size"
                name="size"
                defaultValue={product?.size ?? ""}
                placeholder="ej. 100ml"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Género</Label>
              <Select
                name="gender"
                defaultValue={product?.gender ?? "UNISEX"}
              >
                <SelectTrigger id="gender">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HOMBRE">Hombre</SelectItem>
                  <SelectItem value="MUJER">Mujer</SelectItem>
                  <SelectItem value="UNISEX">Unisex</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select name="type" defaultValue={product?.type ?? "EDP"}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EDP">EDP</SelectItem>
                  <SelectItem value="BODY_MIST">Body Mist</SelectItem>
                  <SelectItem value="MUESTRA">Muestra</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Costo</Label>
              <Input
                id="cost"
                name="cost"
                type="number"
                step="1"
                defaultValue={product ? Number(product.cost) : ""}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="marginPct">Margen (decimal, ej. 0.40 = 40%)</Label>
            <Input
              id="marginPct"
              name="marginPct"
              type="number"
              step="0.01"
              min="0"
              max="0.99"
              defaultValue={product ? Number(product.marginPct) : "0.40"}
              required
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
              {pending ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
