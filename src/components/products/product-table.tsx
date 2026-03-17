"use client";

import { useState } from "react";
import { DataTable } from "@/components/shared/data-table";
import { getProductColumns } from "./columns";
import { ProductForm } from "./product-form";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { deleteProduct } from "@/server/actions/products";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Product } from "@/types";
import { toast } from "sonner";

interface ProductTableProps {
  data: Product[];
}

export function ProductTable({ data }: ProductTableProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const columns = getProductColumns(
    (product) => {
      setEditProduct(product);
      setFormOpen(true);
    },
    (product) => setDeleteTarget(product)
  );

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await deleteProduct(deleteTarget.id);
    setDeleting(false);
    if (result.success) {
      toast.success("Producto eliminado");
      setDeleteTarget(null);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Productos</h2>
        <Button
          onClick={() => {
            setEditProduct(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>
      <DataTable columns={columns} data={data} />
      <ProductForm
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editProduct}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar Producto"
        description={`¿Estás seguro de eliminar "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
