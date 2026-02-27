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

const routes = getAllRoutes();

export default function FareChartPage() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const { calcFare, loaded } = useFareSettings();

  const selectedRoute: Route | null = selectedSlug
    ? (routes.find((r) => routeToSlug(r) === selectedSlug) ?? null)
    : null;

  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/90 via-primary to-primary/60 text-primary-foreground py-16 px-4 sm:px-6">
        <div className="relative mx-auto max-w-3xl text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm">
            <LayoutGrid className="h-4 w-4" /> Fare Chart
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Full Route Fare Chart
          </h1>
          <p className="text-sm sm:text-base text-primary-foreground/80 max-w-md mx-auto">
            View the complete fare matrix for all stops on a selected route.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-full px-4 sm:px-6 py-10 overflow-x-auto">
        <Card className="max-w-6xl mx-auto border-none shadow-none bg-transparent">
          <CardHeader className="px-0">
            <CardTitle className="flex items-center gap-2">
              <Table className="h-5 w-5 text-primary" />
              Select Route for Chart
            </CardTitle>
            <CardDescription>
              Choose a route to see the fare between every combination of stops.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 space-y-6">
            <div className="max-w-md">
              <Select onValueChange={setSelectedSlug}>
                <SelectTrigger id="route-select-chart" className="w-full">
                  <SelectValue placeholder="Choose a bus route…" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {routes.map((r) => (
                    <SelectItem key={r.code.en} value={routeToSlug(r)}>
                      <span className="font-semibold mr-2">{r.code.en}</span>
                      <span className="text-muted-foreground text-xs truncate">
                        {r.name.en}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedRoute && loaded && (
              <div className="overflow-x-auto border rounded-lg bg-card text-card-foreground shadow-sm">
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
                            <span>{colStop.name.en}</span>
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
                            <span>{rowStop.name.en}</span>
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
                                {rowStop.name.en}
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
                              {fare}
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
