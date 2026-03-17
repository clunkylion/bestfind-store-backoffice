import {
  getDashboardKPIs,
  getProductsWithStats,
  getTopProductsByInvestment,
} from "@/server/actions/dashboard";
import { KPICard } from "@/components/dashboard/kpi-card";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  TrendingUp,
  Package,
  ShoppingCart,
  BarChart3,
  Receipt,
  Boxes,
  BadgeDollarSign,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [kpis, productsWithStats, topProducts] = await Promise.all([
    getDashboardKPIs(),
    getProductsWithStats(),
    getTopProductsByInvestment(),
  ]);

  const maxInvestment = topProducts[0]?.totalInvested ?? 1;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Resumen</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Invertido"
          value={formatCurrency(kpis.totalInvested)}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <KPICard
          title="Ingresos"
          value={formatCurrency(kpis.totalRevenue)}
          icon={<BadgeDollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <KPICard
          title="Ganancia Neta"
          value={formatCurrency(kpis.netProfit)}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
        <KPICard
          title="ROI"
          value={`${kpis.roi.toFixed(1)}%`}
          icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
        />
        <KPICard
          title="Unidades en Stock"
          value={kpis.totalStock.toString()}
          icon={<Boxes className="h-4 w-4 text-muted-foreground" />}
        />
        <KPICard
          title="Unidades Vendidas"
          value={kpis.totalSold.toString()}
          icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
        />
        <KPICard
          title="Productos"
          value={kpis.totalProducts.toString()}
          icon={<Package className="h-4 w-4 text-muted-foreground" />}
        />
        <KPICard
          title="Recibos"
          value={kpis.totalReceipts.toString()}
          icon={<Receipt className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Stock status table */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Estado del Stock</h3>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Comprado</TableHead>
                  <TableHead className="text-right">Vendido</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productsWithStats.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-right">{p.purchased}</TableCell>
                    <TableCell className="text-right">{p.sold}</TableCell>
                    <TableCell className="text-right">{p.stock}</TableCell>
                    <TableCell>
                      {p.stock <= 0 ? (
                        <Badge variant="destructive">Agotado</Badge>
                      ) : p.stock <= 2 ? (
                        <Badge variant="secondary">Bajo</Badge>
                      ) : (
                        <Badge variant="outline">Disponible</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Top 5 by investment */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Top 5 por Inversión</h3>
          <div className="space-y-3">
            {topProducts.map((p) => {
              const pct = (p.totalInvested / maxInvestment) * 100;
              return (
                <div key={p.productName} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium truncate mr-2">
                      {p.productName}
                    </span>
                    <span className="text-muted-foreground shrink-0">
                      {formatCurrency(p.totalInvested)}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {topProducts.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Sin datos de compras.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
