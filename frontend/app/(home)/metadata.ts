import type { Metadata } from "next";

const AppUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const appName = process.env.NEXT_PUBLIC_APP_NAME || "Apparel International";

export const metadata: Metadata = {
  title: `Shop High-Quality Products | ${appName}`,
  description: "Browse our curated selection of top-rated products.",
  openGraph: {
    title: `Shop High-Quality Products | ${appName}`,
    description: "Browse our curated selection of top-rated products.",
    images: [
      {
        url: `${AppUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `Preview of ${appName} products`,
      },
    ],
  },
  robots: "index, follow",
};
