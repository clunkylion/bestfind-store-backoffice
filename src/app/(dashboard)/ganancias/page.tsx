import {
  getDashboardKPIs,
  getProductsWithStats,
  getProfitByProduct,
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

export const dynamic = "force-dynamic";

export default async function GananciasPage() {
  const [kpis, productsWithStats, profitByProduct] = await Promise.all([
    getDashboardKPIs(),
    getProductsWithStats(),
    getProfitByProduct(),
  ]);

  const avgTicket =
    kpis.totalSold > 0 ? kpis.totalRevenue / kpis.totalSold : 0;
  const netMarginPct =
    kpis.totalRevenue > 0 ? (kpis.netProfit / kpis.totalRevenue) * 100 : 0;
  const avgProfitPerUnit =
    kpis.totalSold > 0 ? kpis.netProfit / kpis.totalSold : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Ganancias</h2>

      {/* Economic summary */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Resumen Económico</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <KPICard title="Total Invertido" value={formatCurrency(kpis.totalInvested)} />
          <KPICard title="Ingresos" value={formatCurrency(kpis.totalRevenue)} />
          <KPICard
            title="Ganancia Bruta"
            value={formatCurrency(kpis.netProfit)}
          />
          <KPICard
            title="Costo de Ventas"
            value={formatCurrency(kpis.totalRevenue - kpis.netProfit)}
          />
          <KPICard
            title="Ganancia Neta"
            value={formatCurrency(kpis.netProfit)}
          />
        </div>
      </div>

      {/* Indicators */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Indicadores</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <KPICard
            title="Unidades Vendidas"
            value={kpis.totalSold.toString()}
          />
          <KPICard title="Ticket Promedio" value={formatCurrency(avgTicket)} />
          <KPICard
            title="Margen Neto"
            value={`${netMarginPct.toFixed(1)}%`}
          />
          <KPICard
            title="Ganancia Prom./Ud."
            value={formatCurrency(avgProfitPerUnit)}
          />
          <KPICard title="ROI" value={`${kpis.roi.toFixed(1)}%`} />
        </div>
      </div>

      {/* Stock table */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Stock por Producto</h3>
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

      {/* Profit detail table */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Detalle por Producto</h3>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className="text-right">Vendidas</TableHead>
                <TableHead className="text-right">Ingresos</TableHead>
                <TableHead className="text-right">Costo</TableHead>
                <TableHead className="text-right">Ganancia</TableHead>
                <TableHead className="text-right">Margen %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profitByProduct.length > 0 ? (
                profitByProduct.map((p) => (
                  <TableRow key={p.productId}>
                    <TableCell className="font-medium">
                      {p.productName}
                    </TableCell>
                    <TableCell className="text-right">{p.unitsSold}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(p.totalRevenue)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(p.totalCost)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          p.grossProfit >= 0 ? "text-green-600" : "text-red-600"
                        }
                      >
                        {formatCurrency(p.grossProfit)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {p.marginPct.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Sin ventas registradas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
