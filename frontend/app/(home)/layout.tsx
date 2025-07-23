import { Navbar } from "@/components/nav-bar";
import Footer from "@/components/footer";
import WhatsAppIcon from "@/components/whatsapp-icon";
import type { WhatsappData } from "@/types/data";
import CartInitializer from "@/lib/CartInitializer";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const apiSecretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY || "";


async function getWhatsapp() {
  try {
    const res = await fetch(`${apiUrl}/api/whatsapp`, {
      next: { revalidate: 3600 },
      headers: {
        ApiSecretKey: apiSecretKey,
      },
    });

    if (!res.ok) return null;

    const result = await res.json();
    return result?.data || null;
  } catch (error) {
    console.error("Failed to fetch WhatsApp data:", error);
    return null;
  }
}

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data: WhatsappData | null = await getWhatsapp();

  return (
    <section>
      <Navbar />
      {children}

      {data && (
        <WhatsAppIcon data={data} />
      )}

      <Footer />
      <CartInitializer />
    </section>
  );
}
