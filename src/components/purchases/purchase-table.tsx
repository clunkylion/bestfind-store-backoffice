"use client";

import { useState } from "react";
import { DataTable } from "@/components/shared/data-table";
import { getPurchaseColumns } from "./columns";
import { PurchaseForm } from "./purchase-form";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { deletePurchase } from "@/server/actions/purchases";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Product, Purchase } from "@/types";
import { toast } from "sonner";

type PurchaseWithProduct = Purchase & { product: { name: string } };

interface PurchaseTableProps {
  data: PurchaseWithProduct[];
  products: Product[];
}

export function PurchaseTable({ data, products }: PurchaseTableProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editPurchase, setEditPurchase] =
    useState<PurchaseWithProduct | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<PurchaseWithProduct | null>(null);
  const [deleting, setDeleting] = useState(false);

  const columns = getPurchaseColumns(
    (purchase) => {
      setEditPurchase(purchase);
      setFormOpen(true);
    },
    (purchase) => setDeleteTarget(purchase)
  );

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await deletePurchase(deleteTarget.id);
    setDeleting(false);
    if (result.success) {
      toast.success("Compra eliminada");
      setDeleteTarget(null);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Compras</h2>
        <Button
          onClick={() => {
            setEditPurchase(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Compra
        </Button>
      </div>
      <DataTable columns={columns} data={data} />
      <PurchaseForm
        open={formOpen}
        onOpenChange={setFormOpen}
        purchase={editPurchase}
        products={products}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar Compra"
        description="¿Estás seguro de eliminar esta compra? Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
