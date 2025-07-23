'use client'

import { useEffect, useMemo, useState } from "react";
import { Product } from "@/types/data";
import ProductCard from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { ProductPagination } from "@/types/pagination";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const apiSecretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY || "";

export default function ProductDisplaySection({
  products,
}: {
  products: ProductPagination;
}) {
  const [data, setData] = useState<ProductPagination>(products);
  const [searchQuery, setSearchQuery] = useState("");

  const handleUrlChange = async (url: string | null) => {
    if (!url) return;

    try {
      const res = await fetch(url, {
        headers: {
          ApiSecretKey: apiSecretKey,
        },
      });

      const json = await res.json();
      if (json.status === "success") {
        setData(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch paginated data:", err);
    }
  };

  const filteredProducts = useMemo(() => {
    return data.data.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, data]);

  return (
    <section className="max-w-7xl mx-auto px-4 h-full sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 border-b pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Products</h1>
        <Input
          placeholder="Search Products"
          className="w-full sm:w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-center text-gray-500 text-sm mt-6">No products found.</p>
        </div>
      )}

      {/* Pagination */}
      <Pagination className="mt-10">
        <PaginationContent>
          {data.prev_page_url && (
            <PaginationItem>
              <PaginationPrevious className="bg-gray-200/30 hover:bg-gray-200/90 cursor-pointer rounded-md" onClick={() => handleUrlChange(data.prev_page_url)} />
            </PaginationItem>
          )}

          {data.next_page_url && (
            <PaginationItem>
              <PaginationNext className="bg-gray-200/30 hover:bg-gray-200/90 cursor-pointer rounded-md" onClick={() => handleUrlChange(data.next_page_url)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </section>
  );
}
