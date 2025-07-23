
import type { Metadata } from "next";

const AppUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const appName = process.env.NEXT_PUBLIC_APP_NAME || "Apparel International";

export const metadata: Metadata = {
  title: `Track Your Order | ${appName}`,
  description: "Track the status of your orders with your Order ID.",
  openGraph: {
    title: `Track Your Order | ${appName}`,
    description: "Stay updated on your order's status in real-time.",
    url: `${AppUrl}/trackorder`,
    images: [`${AppUrl}/og-image.jpg`], // Make sure this exists in /public
  },
  twitter: {
    card: "summary_large_image",
    title: `Track Your Order | ${appName}`,
    description: "Real-time tracking for your online orders.",
    images: [`${AppUrl}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default metadata;
