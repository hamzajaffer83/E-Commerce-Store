import { type Category } from "@/types/data";
import NavigationLinks from "@/components/navigation-links";
import SidebarLink from "@/components/sidebar-link";
import NavUser from "@/components/nav-user";
import CartIcon from "@/components/cart-icon";
import NavLogo from "./nav-logo";

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
    <nav className="border-b">
      <div className="max-w-6xl mx-auto w-full flex justify-between items-center px-4 py-4">
        <NavLogo />
        <div className="hidden md:flex">
          <NavigationLinks data={data} />
        </div>
        <div className="">
          <div className="hidden md:flex items-center cursor-pointer space-x-4">
            {/*<Search />*/}
            <CartIcon />
            <NavUser />
          </div>
          <div className="md:hidden gap-2">
            <SidebarLink data={data} />
          </div>
        </div>
      </div>
    </nav>
  );
}
