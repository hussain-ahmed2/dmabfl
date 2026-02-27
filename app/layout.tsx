import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "Dhaka Metro Bus Fare",
    template: "%s | Dhaka Metro Bus Fare",
  },
  description:
    "Browse all Dhaka Metro Area bus routes, view stops, distances, and calculate accurate fare estimates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
