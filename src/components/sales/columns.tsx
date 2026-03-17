"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Sale } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

type SaleWithProduct = Sale & { product: { name: string } };

export function getSaleColumns(
  onEdit: (sale: SaleWithProduct) => void,
  onDelete: (sale: SaleWithProduct) => void,
  onToggleSold: (sale: SaleWithProduct) => void
): ColumnDef<SaleWithProduct>[] {
  return [
    {
      accessorKey: "isSold",
      header: "Vendido",
      cell: ({ row }) => (
        <Checkbox
          checked={row.original.isSold}
          onCheckedChange={() => onToggleSold(row.original)}
        />
      ),
    },
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
      header: "Cant.",
    },
    {
      accessorKey: "salePrice",
      header: "Precio Venta",
      cell: ({ row }) => formatCurrency(row.original.salePrice),
    },
    {
      accessorKey: "totalRevenue",
      header: "Ingreso Total",
      cell: ({ row }) => formatCurrency(row.original.totalRevenue),
    },
    {
      accessorKey: "totalCost",
      header: "Costo Total",
      cell: ({ row }) => formatCurrency(row.original.totalCost),
    },
    {
      accessorKey: "grossProfit",
      header: "Ganancia Bruta",
      cell: ({ row }) => {
        const profit = Number(row.original.grossProfit);
        return (
          <span className={profit >= 0 ? "text-green-600" : "text-red-600"}>
            {formatCurrency(profit)}
          </span>
        );
      },
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
