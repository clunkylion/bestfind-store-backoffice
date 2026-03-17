"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { GENDER_LABELS, PRODUCT_TYPE_LABELS } from "@/lib/constants";

export function getProductColumns(
  onEdit: (product: Product) => void,
  onDelete: (product: Product) => void
): ColumnDef<Product>[] {
  return [
    {
      accessorKey: "name",
      header: "Nombre",
    },
    {
      accessorKey: "size",
      header: "Tamaño",
      cell: ({ row }) => row.original.size || "—",
    },
    {
      accessorKey: "gender",
      header: "Género",
      cell: ({ row }) => (
        <Badge variant="outline">
          {GENDER_LABELS[row.original.gender]}
        </Badge>
      ),
    },
    {
      accessorKey: "type",
      header: "Tipo",
      cell: ({ row }) => PRODUCT_TYPE_LABELS[row.original.type],
    },
    {
      accessorKey: "cost",
      header: "Costo",
      cell: ({ row }) => formatCurrency(row.original.cost),
    },
    {
      accessorKey: "marginPct",
      header: "Margen %",
      cell: ({ row }) => formatPercent(row.original.marginPct),
    },
    {
      accessorKey: "salePrice",
      header: "Precio Venta",
      cell: ({ row }) => formatCurrency(row.original.salePrice),
    },
    {
      id: "profitPerUnit",
      header: "Ganancia/Ud.",
      cell: ({ row }) => {
        const profit =
          Number(row.original.salePrice) - Number(row.original.cost);
        return formatCurrency(profit);
      },
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
