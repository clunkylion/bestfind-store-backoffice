"use client";

import { useState } from "react";
import { DataTable } from "@/components/shared/data-table";
import { getSaleColumns } from "./columns";
import { SaleForm } from "./sale-form";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { deleteSale, toggleSoldStatus } from "@/server/actions/sales";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Product, Sale } from "@/types";
import { toast } from "sonner";

type SaleWithProduct = Sale & { product: { name: string } };

interface SaleTableProps {
  data: SaleWithProduct[];
  products: Product[];
}

export function SaleTable({ data, products }: SaleTableProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editSale, setEditSale] = useState<SaleWithProduct | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SaleWithProduct | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  async function handleToggleSold(sale: SaleWithProduct) {
    const result = await toggleSoldStatus(sale.id);
    if (result.success) {
      toast.success(
        result.data.isSold ? "Marcada como vendida" : "Marcada como no vendida"
      );
    } else {
      toast.error(result.error);
    }
  }

  const columns = getSaleColumns(
    (sale) => {
      setEditSale(sale);
      setFormOpen(true);
    },
    (sale) => setDeleteTarget(sale),
    handleToggleSold
  );

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await deleteSale(deleteTarget.id);
    setDeleting(false);
    if (result.success) {
      toast.success("Venta eliminada");
      setDeleteTarget(null);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Ventas</h2>
        <Button
          onClick={() => {
            setEditSale(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Venta
        </Button>
      </div>
      <DataTable columns={columns} data={data} />
      <SaleForm
        open={formOpen}
        onOpenChange={setFormOpen}
        sale={editSale}
        products={products}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar Venta"
        description="¿Estás seguro de eliminar esta venta? Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
