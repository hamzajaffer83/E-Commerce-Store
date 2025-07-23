import { type Category } from "@/types/data";
import NavBarClient from "./nav-bar-client";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const apiSecretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY || "";

async function getCategory() {
  try {
    const res = await fetch(`${apiUrl}/api/categories/all`, {
      cache: "force-cache",
      next: { revalidate: 3600 },
      headers: {
        ApiSecretKey: apiSecretKey,
      },
    });

    if (!res.ok) {
      return [];
    }
    const json = await res.json();
    return json;
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

export async function Navbar() {
  const { data }: { data: Category[] } = await getCategory();

  return (
    <NavBarClient data={data} />
  );
}
