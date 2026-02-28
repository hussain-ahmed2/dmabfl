import type { Metadata } from "next";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";
import { cn } from "@/lib/utils";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontBengali = Noto_Sans_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali"],
});

export const metadata: Metadata = {
  title: "Dhaka Metro Bus Fare",
  description: "Find your bus route and fare in Dhaka city.",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "bn")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-3448314338744263" />
        {/* Only load AdSense in production to avoid distracting errors in local development */}
        {process.env.NODE_ENV === "production" && (
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3448314338744263"
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body
        className={cn(
          `text-sm antialiased min-h-screen bg-background text-foreground tracking-tight selection:bg-primary/20`,
          locale === "bn" ? fontBengali.className : fontSans.className,
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
