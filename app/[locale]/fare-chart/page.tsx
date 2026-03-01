"use client";

import { useState, useRef, useEffect } from "react";
import { Table, LayoutGrid, ArrowDown, ArrowRight } from "lucide-react";
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
import { formatNumber, cn } from "@/lib/utils";

const routes = getAllRoutes();

export default function FareChartPage() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    routes[0] ? routeToSlug(routes[0]) : null,
  );
  const [hoveredCell, setHoveredCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [selectedRange, setSelectedRange] = useState<{
    start: number;
    end: number;
  } | null>(null);

  const summaryRef = useRef<HTMLDivElement>(null);

  const { calcFare, loaded } = useFareSettings();
  const t = useTranslations("Chart");
  const locale = useLocale();

  const selectedRoute: Route | null = selectedSlug
    ? (routes.find((r) => routeToSlug(r) === selectedSlug) ?? null)
    : null;

  useEffect(() => {
    if (selectedRange && summaryRef.current) {
      summaryRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedRange]);

  const handleCellClick = (row: number, col: number) => {
    if (row === col) return;
    setSelectedRange({ start: col, end: row });
  };

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

      <section className="mx-auto max-w-full px-4 sm:px-6 py-10">
        <Card className="container mx-auto border-transparent ring-0 shadow-none bg-transparent">
          <CardHeader className="px-0">
            <CardTitle className="flex items-center gap-2">
              <Table className="h-5 w-5 text-primary" />
              {t("selectRoute")}
            </CardTitle>
            <CardDescription>{t("chooseRouteDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="px-0 space-y-6">
            <div className="max-w-md">
              <Select
                value={selectedSlug ?? undefined}
                onValueChange={setSelectedSlug}
              >
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
              <div className="w-full overflow-x-auto border rounded-xl bg-card text-card-foreground shadow-sm">
                <table
                  className="w-full text-[10px] sm:text-sm text-center border-collapse min-w-max select-none"
                  onMouseLeave={() => setHoveredCell(null)}
                >
                  <thead>
                    <tr className="sticky top-0 z-20">
                      <th className="p-1.5 sm:p-2.5 border-b border-r bg-muted sticky left-0 top-0 z-50 shadow-[1px_0_0_0_var(--border)] w-[80px] sm:w-auto">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[8px] sm:text-[10px] font-bold text-primary uppercase">
                            {t("stops")}
                          </span>
                          <span className="text-[7px] sm:text-[8px] text-muted-foreground uppercase leading-none">
                            {t("km")}
                          </span>
                        </div>
                      </th>
                      {selectedRoute.stops.map((colStop, colIdx) => {
                        const isHovered = hoveredCell?.col === colIdx;
                        const isSelected =
                          selectedRange &&
                          colIdx >= selectedRange.start &&
                          colIdx <= selectedRange.end;

                        return (
                          <th
                            key={colIdx}
                            className={cn(
                              "p-2 sm:p-3 border-b border-r font-medium transition-colors duration-200 bg-muted/50",
                              isHovered ? "bg-primary/10" : "bg-muted/30",
                              isSelected && "bg-primary/20 text-primary",
                            )}
                          >
                            <div className="flex flex-col items-center gap-0.5">
                              <span className="text-muted-foreground text-[8px] sm:text-[10px] uppercase">
                                {formatNumber(colStop.distance, locale)} KM
                              </span>
                              <span className="text-[9px] sm:text-[11px] leading-tight">
                                {locale === "en"
                                  ? colStop.name.en
                                  : colStop.name.bn}
                              </span>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRoute.stops.map((rowStop, rowIdx) => (
                      <tr key={rowIdx} className="group">
                        <td
                          className={cn(
                            "p-1 sm:p-1.5 border-b border-r font-semibold sticky left-0 z-30 shadow-[1px_0_0_0_var(--border)] whitespace-nowrap text-left transition-colors duration-200 w-[80px] sm:w-auto",
                            hoveredCell?.row === rowIdx
                              ? "bg-muted"
                              : "bg-card",
                            selectedRange &&
                              rowIdx >= selectedRange.start &&
                              rowIdx <= selectedRange.end &&
                              "bg-accent text-primary",
                          )}
                        >
                          <div className="flex flex-col gap-0.5 px-0.5 overflow-hidden">
                            <span className="text-[8px] sm:text-[11px] truncate max-w-full">
                              {locale === "en"
                                ? rowStop.name.en
                                : rowStop.name.bn}
                            </span>
                            <span className="text-muted-foreground/50 text-[6px] sm:text-[8px] font-mono leading-none">
                              {formatNumber(rowStop.distance, locale)} {t("km")}
                            </span>
                          </div>
                        </td>
                        {selectedRoute.stops.map((colStop, colIdx) => {
                          const isDiagonal = rowIdx === colIdx;
                          const isAboveDiagonal = colIdx > rowIdx;
                          const isHovered =
                            hoveredCell?.row === rowIdx ||
                            hoveredCell?.col === colIdx;
                          const isCellHovered =
                            hoveredCell?.row === rowIdx &&
                            hoveredCell?.col === colIdx;

                          // Selection logic
                          const isInRange =
                            selectedRange &&
                            rowIdx >= selectedRange.start &&
                            rowIdx <= selectedRange.end &&
                            colIdx >= selectedRange.start &&
                            colIdx <= selectedRange.end;

                          const isSelectedCell =
                            selectedRange?.end === rowIdx &&
                            selectedRange?.start === colIdx;

                          if (isAboveDiagonal) {
                            return (
                              <td
                                key={colIdx}
                                className={cn(
                                  "p-3 border-b border-r transition-colors",
                                  isHovered ? "bg-muted/10" : "bg-muted/5",
                                )}
                              />
                            );
                          }

                          if (isDiagonal) {
                            const isPartOfRoute =
                              selectedRange &&
                              rowIdx >= selectedRange.start &&
                              rowIdx <= selectedRange.end;

                            return (
                              <td
                                key={colIdx}
                                className={cn(
                                  "p-1.5 sm:p-3 border-b border-r transition-all duration-300 relative",
                                  isPartOfRoute
                                    ? "bg-primary/20"
                                    : "bg-muted/20",
                                  isCellHovered && "bg-primary/30",
                                )}
                                onMouseEnter={() =>
                                  setHoveredCell({ row: rowIdx, col: colIdx })
                                }
                              >
                                <div className="flex flex-col items-center gap-0.5 relative z-0">
                                  <span className="text-[7px] sm:text-[9px] uppercase tracking-wide text-muted-foreground font-medium">
                                    {formatNumber(rowStop.distance, locale)} KM
                                  </span>
                                  <span className="text-[8px] sm:text-[10px] uppercase tracking-tighter text-foreground font-semibold leading-tight">
                                    {locale === "en"
                                      ? rowStop.name.en
                                      : rowStop.name.bn}
                                  </span>
                                </div>
                                {isPartOfRoute && (
                                  <div className="absolute inset-x-0 bottom-0.5 sm:bottom-1 flex justify-center">
                                    <ArrowDown className="h-2 w-2 sm:h-3 sm:w-3 text-primary animate-bounce" />
                                  </div>
                                )}
                              </td>
                            );
                          }

                          const distance = Math.abs(
                            rowStop.distance - colStop.distance,
                          );
                          const fare = calcFare(distance);
                          const isIntersection =
                            selectedRange?.end === rowIdx &&
                            selectedRange?.start === colIdx;

                          return (
                            <td
                              key={colIdx}
                              onMouseEnter={() =>
                                setHoveredCell({ row: rowIdx, col: colIdx })
                              }
                              onClick={() => handleCellClick(rowIdx, colIdx)}
                              className={cn(
                                "p-2 sm:p-3 border-b border-r text-foreground cursor-pointer transition-all duration-200 relative",
                                isHovered ? "bg-primary/5" : "bg-card",
                                isCellHovered &&
                                  "bg-primary/10 scale-[1.02] z-10 shadow-sm",
                                isInRange && "bg-primary/5",
                                isIntersection &&
                                  "bg-primary/20 ring-2 ring-primary/40 z-20 font-bold",
                              )}
                            >
                              <span
                                className={cn(
                                  "transition-transform text-[10px] sm:text-sm",
                                  isCellHovered &&
                                    "scale-110 inline-block font-bold text-primary",
                                )}
                              >
                                ৳{formatNumber(fare, locale)}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedRange && selectedRoute && (
              <div
                ref={summaryRef}
                className="p-4 sm:p-6 rounded-2xl bg-muted/20 border border-border/50 shadow-inner mt-4 mx-2 sm:mx-0"
              >
                <div className="flex flex-col gap-4 sm:gap-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h3 className="text-[10px] sm:text-xs font-extrabold text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                      {t("tripSummary")}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full">
                        {formatNumber(
                          Math.abs(
                            selectedRoute.stops[selectedRange.end].distance -
                              selectedRoute.stops[selectedRange.start].distance,
                          ),
                          locale,
                        )}{" "}
                        {t("km")}
                      </div>
                      <div className="text-[10px] sm:text-xs font-black px-2 sm:px-3 py-1 bg-primary text-primary-foreground rounded-full shadow-sm ring-2 ring-primary/20">
                        ৳
                        {formatNumber(
                          calcFare(
                            Math.abs(
                              selectedRoute.stops[selectedRange.end].distance -
                                selectedRoute.stops[selectedRange.start]
                                  .distance,
                            ),
                          ),
                          locale,
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-y-6 sm:gap-y-8 bg-background/50 p-3 sm:p-6 rounded-xl border border-border/40 justify-center sm:justify-start">
                    {selectedRoute.stops
                      .slice(selectedRange.start, selectedRange.end + 1)
                      .map((stop, i, arr) => (
                        <div key={i} className="flex items-center">
                          <div className="flex flex-col gap-1 items-center text-center px-2 sm:px-4">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-[8px] sm:text-[10px] font-bold text-primary">
                              {i + 1}
                            </div>
                            <span className="text-[9px] sm:text-[11px] font-bold text-foreground max-w-[60px] sm:max-w-[80px] leading-tight line-clamp-2">
                              {locale === "en" ? stop.name.en : stop.name.bn}
                            </span>
                          </div>
                          {i < arr.length - 1 && (
                            <div className="flex items-center">
                              <ArrowRight className="h-3 w-3 sm:h-5 sm:w-5 text-primary/30 mx-0.5 sm:mx-1 animate-pulse" />
                            </div>
                          )}
                        </div>
                      ))}
                  </div>

                  <div className="flex justify-center sm:justify-end">
                    <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/30 px-2 py-0.5 rounded">
                      {selectedRange.end - selectedRange.start + 1} {t("stops")}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
