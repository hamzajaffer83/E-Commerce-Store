import { Product } from "@/types/data";
import SingleProduct from "./product-page";
import { Metadata } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const apiSecretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY || "";
const appName = process.env.NEXT_PUBLIC_APP_NAME || "Apparel International";

interface PageProps {
  params: {
    slug: string;
  };
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${apiUrl}/api/product/${slug}`, {
      headers: {
        ApiSecretKey: apiSecretKey,
      },
      cache: "no-store",
    });

    const data = await res.json();
    return data.status === "success" ? data.data : null;
  } catch (err) {
    console.error("Error fetching product:", err);
    return null;
  }
}

// ✅ SEO Metadata for this dynamic product page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);

  if (!product) {
    return {
      title: `Product Not Found | ${appName}`,
      description: "This product does not exist.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [`${apiUrl}/${product.cover_image}`],
    },
  };
}

// ✅ Page Component
export default async function Page({ params }: PageProps) {
  const product = await getProduct(params.slug);

  if (!product) {
    return <p className="text-center py-10 text-red-500">Product not found</p>;
  }

  return (
    <section>
      <SingleProduct product={product} />
    </section>
  );
}
