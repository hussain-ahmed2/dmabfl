"use client";

import { Bus } from "lucide-react";
import { Button } from "@/components/ui/button";
import FareSettingsDialog from "@/components/fare-settings-dialog";
import { useStore } from "@/hooks/store";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";

export default function Navbar() {
  const { settings, setSettings } = useStore();
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const changeLocale = (newLocale: "en" | "bn") => {
    router.replace({ pathname }, { locale: newLocale });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Bus className="h-4 w-4" />
          </div>
          <div className="leading-tight hidden sm:block">
            <span className="block text-sm font-bold tracking-tight">
              {t("brandTitle")}
            </span>
            <span className="block text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
              {t("brandSubtitle")}
            </span>
          </div>
        </Link>

        {/* Desktop Nav links */}
        <nav className="hidden md:flex items-center gap-2 flex-1 justify-center">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">{t("navRoutes")}</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/fare-calculator">{t("navCalculator")}</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/fare-chart">{t("navChart")}</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/about">{t("navAbout")}</Link>
          </Button>
        </nav>

        {/* Global Tools: Lang & Settings */}
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="flex items-center bg-muted/50 rounded-full p-0.5 border border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => changeLocale("en")}
              className={`h-7 px-2.5 text-xs rounded-full ${locale === "en" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:bg-transparent"}`}
            >
              EN
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => changeLocale("bn")}
              className={`h-7 px-2.5 text-xs rounded-full ${locale === "bn" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:bg-transparent"}`}
            >
              বাংলা
            </Button>
          </div>

          <div className="w-px h-5 bg-border mx-1" />

          <FareSettingsDialog settings={settings} onSave={setSettings} />
        </div>
      </div>

      {/* Mobile Nav strip */}
      <div className="md:hidden border-t border-border/40 bg-background/80 backdrop-blur-lg py-2 px-4 shadow-sm">
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-8 text-xs px-3"
          >
            <Link href="/">{t("navRoutes")}</Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-8 text-xs px-3"
          >
            <Link href="/fare-calculator">{t("navMobileCalc")}</Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-8 text-xs px-3"
          >
            <Link href="/fare-chart">{t("navMobileChart")}</Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-8 text-xs px-3"
          >
            <Link href="/about">{t("navAbout")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
