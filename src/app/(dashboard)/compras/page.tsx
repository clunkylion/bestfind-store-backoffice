import { getPurchases } from "@/server/actions/purchases";
import { getProducts } from "@/server/actions/products";
import { PurchaseTable } from "@/components/purchases/purchase-table";


export default async function ComprasPage() {
  const [purchases, products] = await Promise.all([
    getPurchases(),
    getProducts(),
  ]);

  return (
    <PurchaseTable
      data={purchases as (typeof purchases[number] & { product: { name: string } })[]}
      products={products}
    />
  );
}
