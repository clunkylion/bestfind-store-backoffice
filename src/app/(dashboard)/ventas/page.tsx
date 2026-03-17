import { getSales } from "@/server/actions/sales";
import { getProducts } from "@/server/actions/products";
import { SaleTable } from "@/components/sales/sale-table";

export const dynamic = "force-dynamic";

export default async function VentasPage() {
  const [sales, products] = await Promise.all([getSales(), getProducts()]);

  return (
    <SaleTable
      data={sales as (typeof sales[number] & { product: { name: string } })[]}
      products={products}
    />
  );
}
