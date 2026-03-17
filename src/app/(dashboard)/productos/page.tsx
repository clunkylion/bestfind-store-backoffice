import { getProducts } from "@/server/actions/products";
import { ProductTable } from "@/components/products/product-table";

export const dynamic = "force-dynamic";

export default async function ProductosPage() {
  const products = await getProducts();
  return <ProductTable data={products} />;
}
