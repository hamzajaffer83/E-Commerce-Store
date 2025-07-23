"use client";

import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Head from "next/head";
import HomeProductSectionSkeleton from "@/components/home-product-section-skeleton";
import ProdductDisplaySection from "@/components/sections/product-display-section";
import { useDispatch } from "react-redux";
import { updateLogo } from "@/redux/logoSlice";
import { ProductPagination } from "@/types/pagination";
import { setColor } from "@/redux/colorSlice";
import { useAppDispatch } from "@/redux/hooks";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const apiSecretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY || "";
const appName = process.env.NEXT_PUBLIC_APP_NAME || "Apparel International";

export default function CategoryProduct() {
  const params = useParams();
  const name = params?.name as string;
  const dispatch = useAppDispatch();

  const [data, setData] = useState<ProductPagination | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!name) return;

    // Fetch product related to a category with pagination
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/product/category/${name}`, {
          next: { revalidate: 3600 },
          headers: {
            ApiSecretKey: apiSecretKey,
          },
        });

        const json = await res.json();

        if (json.status === "success") {
          setData(json.data);
        } else {
          setData(null);
        }
      } catch (err) {
        console.error("Failed to fetch category data:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    // Fetch logo of a give category name
    const fetchLogo = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/${name}/logo`, {
          next: { revalidate: 3600 },
          headers: {
            ApiSecretKey: apiSecretKey,
          },
        });

        const json = await res.json();
        if (json && json.logo) {
          dispatch(updateLogo(`${apiUrl}/storage/${json.logo}`));
        }
      } catch (err) {
        // console.error("Failed to fetch logo:", err);
      }
    };

    const fetchColor = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/${name}/color-theme`, {
          next: { revalidate: 3600 },
          headers: {
            ApiSecretKey: apiSecretKey,
          },
        });

        const json = await res.json();

        const color = json?.color || "#ffffff"; // Fallback if json.color is undefined/null
        dispatch(setColor(color));
      } catch (err) {
        console.log("Failed to fetch color, using default.");
        dispatch(setColor("#ffffff"));
      }
    };


    fetchProducts();
    fetchLogo();
    fetchColor();
  }, [name, dispatch]);

  return (
    <Suspense fallback={<HomeProductSectionSkeleton />}>
      {/* ✅ SEO Head */}
      {!loading && data && (
        <Head>
          <title>{`${name} Products | ${appName}`}</title>
          <meta name="description" content={`Explore the latest ${name} products at the best prices.`} />
          <meta property="og:title" content={`${name} Products | ${appName}`} />
          <meta property="og:description" content={`Find top-quality ${name} products tailored for you.`} />
          <meta name="robots" content="index, follow" />
        </Head>
      )}

      <section className="max-w-7xl mx-auto px-4 h-[100vh] sm:px-6 lg:px-8 py-6">
        {loading ? (
          <HomeProductSectionSkeleton />
        ) : data ? (
          <ProdductDisplaySection products={data} />
        ) : (
          <div className="flex justify-center items-center">
            <p className="text-center text-gray-500 text-sm mt-6">
              No Products Found
            </p>
          </div>
        )}
      </section>
    </Suspense>
  );
}
