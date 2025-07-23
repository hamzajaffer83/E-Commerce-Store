import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {ToastContainer} from 'react-toastify';
import {ReduxProvider} from "@/app/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const AppName = process.env.NEXT_PUBLIC_APP_NAME;
const AppDesc = process.env.NEXT_PUBLIC_APP_Desc;

export const metadata: Metadata = {
  title: AppName,
  description: AppDesc,
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <ReduxProvider>{children}</ReduxProvider>
      <ToastContainer/>
      </body>
    </html>
  );
}
