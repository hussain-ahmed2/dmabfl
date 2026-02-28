"use client";

import { useState } from "react";
import { Table, LayoutGrid } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllRoutes, routeToSlug } from "@/lib/busData";
import { useFareSettings } from "@/hooks/use-fare-settings";
import type { Route } from "@/types";
import { useTranslations, useLocale } from "next-intl";

const routes = getAllRoutes();

export default function FareChartPage() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const { calcFare, loaded } = useFareSettings();
  const t = useTranslations("Chart");
  const locale = useLocale();

  const selectedRoute: Route | null = selectedSlug
    ? (routes.find((r) => routeToSlug(r) === selectedSlug) ?? null)
    : null;

  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden bg-linear-to-br from-primary/90 via-primary to-primary/60 text-primary-foreground py-16 px-4 sm:px-6">
        <div className="relative mx-auto max-w-3xl text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm">
            <LayoutGrid className="h-4 w-4" /> {t("badge")}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {t("title")}
          </h1>
          <p className="text-sm sm:text-base text-primary-foreground/80 max-w-md mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-full px-4 sm:px-6 py-10 overflow-x-auto">
        <Card className="container mx-auto border-none shadow-none bg-transparent">
          <CardHeader className="px-0">
            <CardTitle className="flex items-center gap-2">
              <Table className="h-5 w-5 text-primary" />
              {t("selectRoute")}
            </CardTitle>
            <CardDescription>{t("chooseRouteDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="px-0 space-y-6">
            <div className="max-w-md">
              <Select onValueChange={setSelectedSlug}>
                <SelectTrigger id="route-select-chart" className="w-full">
                  <SelectValue placeholder={t("selectRoute")} />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {routes.map((r) => (
                    <SelectItem key={r.code.en} value={routeToSlug(r)}>
                      <span className="font-semibold mr-2">
                        {locale === "en" ? r.code.en : r.code.bn}
                      </span>
                      <span className="text-muted-foreground text-xs truncate">
                        {locale === "en" ? r.name.en : r.name.bn}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedRoute && loaded && (
              <div className="overflow-x-auto flex border rounded-lg bg-card text-card-foreground shadow-sm">
                <table className="w-full text-sm text-center border-collapse min-w-max">
                  <thead>
                    <tr>
                      <th className="p-3 border-b border-r bg-muted/50 text-left sticky left-0 z-20 shadow-[1px_0_0_0_var(--border)]">
                        Stops / KM
                      </th>
                      {selectedRoute.stops.map((colStop, colIdx) => (
                        <th
                          key={colIdx}
                          className="p-3 border-b border-r bg-muted/50 font-medium whitespace-nowrap"
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-muted-foreground text-[10px] uppercase">
                              {colStop.distance} KM
                            </span>
                            <span>
                              {locale === "en"
                                ? colStop.name.en
                                : colStop.name.bn}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRoute.stops.map((rowStop, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-muted/30">
                        <td className="p-3 border-b border-r font-semibold bg-background sticky left-0 z-10 shadow-[1px_0_0_0_var(--border)] whitespace-nowrap text-left">
                          <div className="flex justify-between gap-4">
                            <span>
                              {locale === "en"
                                ? rowStop.name.en
                                : rowStop.name.bn}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              {rowStop.distance}
                            </span>
                          </div>
                        </td>
                        {selectedRoute.stops.map((colStop, colIdx) => {
                          if (rowIdx === colIdx) {
                            return (
                              <td
                                key={colIdx}
                                className="p-3 border-b border-r bg-muted/20 font-bold text-muted-foreground"
                              >
                                {locale === "en"
                                  ? rowStop.name.en
                                  : rowStop.name.bn}
                              </td>
                            );
                          }
                          const distance = Math.abs(
                            rowStop.distance - colStop.distance,
                          );
                          const fare = calcFare(distance);
                          return (
                            <td
                              key={colIdx}
                              className="p-3 border-b border-r text-foreground"
                            >
                              ৳{fare}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
