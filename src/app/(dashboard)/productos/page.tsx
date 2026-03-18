import { getProducts } from "@/server/actions/products";
import { ProductTable } from "@/components/products/product-table";


export default async function ProductosPage() {
  const products = await getProducts();
  return <ProductTable data={products} />;
}
