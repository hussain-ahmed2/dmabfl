"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Route } from "@/types";
import { cn, formatNumber } from "@/lib/utils";
import { Map } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useFareSettings } from "@/hooks/use-fare-settings";

interface StopTimelineProps {
  route: Route;
}

export default function StopTimeline({ route }: StopTimelineProps) {
  const stops = route.stops;
  const tRoute = useTranslations("Route");
  const tChart = useTranslations("Chart");
  const locale = useLocale();
  const { calcFare, loaded } = useFareSettings();

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Map className="h-4 w-4 text-primary" /> {tRoute("routeDetails")}
            <span className="text-xs font-normal text-muted-foreground">
              ({formatNumber(stops.length, locale)} {tRoute("stops")})
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 pb-6">
        <Tabs defaultValue="timeline" className="w-full">
          <div className="px-4 pb-4">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="timeline">
                {tRoute("timelineTab", { defaultValue: "Timeline" })}
              </TabsTrigger>
              <TabsTrigger value="chart">
                {tRoute("chartTab", { defaultValue: "Fare Chart" })}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="timeline" className="px-4 mt-0">
            <div className="relative ml-3">
              {stops.map((stop, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === stops.length - 1;
                const segDist =
                  idx > 0
                    ? (stop.distance - stops[idx - 1].distance).toFixed(1)
                    : null;

                return (
                  <div key={idx} className="relative flex gap-4">
                    {/* Timeline track */}
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "rounded-full border-2 border-background z-10 shrink-0",
                          isFirst
                            ? "h-3.5 w-3.5 bg-green-500"
                            : isLast
                              ? "h-3.5 w-3.5 bg-red-500"
                              : "h-2.5 w-2.5 bg-primary mt-[3px]",
                        )}
                      />
                      {!isLast && (
                        <div className="w-px flex-1 bg-border min-h-[36px]" />
                      )}
                    </div>

                    {/* Stop content */}
                    <div className="pb-5 flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p
                            className={cn(
                              "text-sm font-medium leading-snug",
                              (isFirst || isLast) && "font-semibold",
                            )}
                          >
                            {locale === "en" ? stop.name.en : stop.name.bn}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {locale === "en" ? stop.name.bn : stop.name.en}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-semibold text-foreground">
                            {formatNumber(stop.distance, locale)} {tRoute("km")}
                          </span>
                          {segDist && (
                            <p className="text-[10px] text-muted-foreground">
                              +{formatNumber(segDist, locale)} {tRoute("km")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="chart" className="mt-0">
            {loaded ? (
              <div className="w-full overflow-x-auto border-t border-b bg-card text-card-foreground">
                <table className="w-full text-xs text-center border-collapse min-w-max">
                  <thead>
                    <tr>
                      <th className="p-2 border-b border-r bg-muted/50 text-left sticky left-0 z-20 shadow-[1px_0_0_0_var(--border)] text-[10px] uppercase font-bold text-muted-foreground">
                        KM / {tChart("badge")}
                      </th>
                      {stops.map((colStop, colIdx) => (
                        <th
                          key={colIdx}
                          className="px-2 py-1.5 border-b border-r bg-muted/50 font-medium whitespace-nowrap"
                        >
                          <div className="flex flex-col items-center gap-0.5">
                            <span className="text-muted-foreground text-[9px] uppercase font-bold tracking-widest">
                              {formatNumber(colStop.distance, locale)}
                            </span>
                            <span className="text-[10px] max-w-[60px] truncate block">
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
                    {stops.map((rowStop, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-muted/30">
                        <td className="p-2 border-b border-r font-semibold bg-background sticky left-0 z-10 shadow-[1px_0_0_0_var(--border)] whitespace-nowrap text-left text-[11px]">
                          <div className="flex justify-between items-center gap-3">
                            <span className="truncate max-w-[120px]">
                              {locale === "en"
                                ? rowStop.name.en
                                : rowStop.name.bn}
                            </span>
                            <span className="text-muted-foreground text-[9px] font-bold tracking-widest bg-muted/30 px-1 rounded-sm">
                              {formatNumber(rowStop.distance, locale)}
                            </span>
                          </div>
                        </td>
                        {stops.map((colStop, colIdx) => {
                          if (rowIdx === colIdx) {
                            return (
                              <td
                                key={colIdx}
                                className="p-2 border-b border-r bg-muted/20 font-bold text-muted-foreground/30 text-[10px]"
                              >
                                —
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
                              className="px-1.5 py-2 border-b border-r text-foreground text-[11px]"
                            >
                              ৳{formatNumber(fare, locale)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-muted-foreground animate-pulse">
                Loading chart...
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
