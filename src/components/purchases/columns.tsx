"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Purchase } from "@/types";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

type PurchaseWithProduct = Purchase & { product: { name: string } };

export function getPurchaseColumns(
  onEdit: (purchase: PurchaseWithProduct) => void,
  onDelete: (purchase: PurchaseWithProduct) => void
): ColumnDef<PurchaseWithProduct>[] {
  return [
    {
      accessorKey: "date",
      header: "Fecha",
      cell: ({ row }) => format(new Date(row.original.date), "dd/MM/yyyy"),
    },
    {
      id: "product",
      header: "Producto",
      cell: ({ row }) => row.original.product.name,
    },
    {
      accessorKey: "quantity",
      header: "Cantidad",
    },
    {
      accessorKey: "unitPrice",
      header: "Precio Unit.",
      cell: ({ row }) => formatCurrency(row.original.unitPrice),
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => formatCurrency(row.original.total),
    },
    {
      accessorKey: "receiptNum",
      header: "Recibo",
      cell: ({ row }) => row.original.receiptNum || "—",
    },
    {
      accessorKey: "notes",
      header: "Notas",
      cell: ({ row }) => row.original.notes || "—",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(row.original)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];
}
