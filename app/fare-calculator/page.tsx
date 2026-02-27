"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Ticket, ArrowUpDown } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getAllRoutes, getFareBetweenStops, routeToSlug } from "@/lib/busData";
import type { Route } from "@/types";

const routes = getAllRoutes();

export default function FareCalculatorPage() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [fromIdx, setFromIdx] = useState<number | null>(null);
  const [toIdx, setToIdx] = useState<number | null>(null);

  const selectedRoute: Route | null = selectedSlug
    ? (routes.find((r) => routeToSlug(r) === selectedSlug) ?? null)
    : null;

  const handleRouteChange = useCallback((slug: string) => {
    setSelectedSlug(slug);
    setFromIdx(null);
    setToIdx(null);
  }, []);

  const canCalc =
    selectedRoute !== null &&
    fromIdx !== null &&
    toIdx !== null &&
    fromIdx !== toIdx;

  const fare = canCalc
    ? getFareBetweenStops(selectedRoute!, fromIdx!, toIdx!)
    : null;

  const distance = canCalc
    ? Math.abs(
        selectedRoute!.stops[toIdx!].distance -
          selectedRoute!.stops[fromIdx!].distance,
      ).toFixed(1)
    : null;

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/90 via-primary to-primary/60 text-primary-foreground py-16 px-4 sm:px-6">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-black/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm">
            🧮 Fare Calculator
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Calculate Your Bus Fare
          </h1>
          <p className="text-sm sm:text-base text-primary-foreground/80 max-w-md mx-auto">
            Pick a route and your stops to get an instant fare estimate for any
            journey in Dhaka.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-primary" />
              Fare Estimator
            </CardTitle>
            <CardDescription>
              Select a route then choose your boarding and alighting stops.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Route selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Route
              </label>
              <Select onValueChange={handleRouteChange}>
                <SelectTrigger id="route-select" className="w-full">
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

            <AnimatePresence>
              {selectedRoute && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 overflow-hidden"
                >
                  {/* From stop */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      From
                    </label>
                    <Select onValueChange={(v) => setFromIdx(Number(v))}>
                      <SelectTrigger id="from-stop-global" className="w-full">
                        <SelectValue placeholder="Select boarding stop" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedRoute.stops.map((stop, idx) => (
                          <SelectItem key={idx} value={String(idx)}>
                            {stop.name.en}
                            <span className="ml-2 text-xs text-muted-foreground">
                              {stop.distance} km
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-center">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  {/* To stop */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      To
                    </label>
                    <Select onValueChange={(v) => setToIdx(Number(v))}>
                      <SelectTrigger id="to-stop-global" className="w-full">
                        <SelectValue placeholder="Select alighting stop" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedRoute.stops.map((stop, idx) => (
                          <SelectItem key={idx} value={String(idx)}>
                            {stop.name.en}
                            <span className="ml-2 text-xs text-muted-foreground">
                              {stop.distance} km
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Result */}
                  <AnimatePresence mode="wait">
                    {fare !== null ? (
                      <motion.div
                        key="fare-result"
                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        className="rounded-xl bg-primary/5 border border-primary/20 p-6 text-center space-y-2"
                      >
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                          Estimated Fare
                        </p>
                        <p className="text-5xl font-extrabold text-primary">
                          ৳{fare}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {distance} km ·{" "}
                          <span className="font-medium">
                            {selectedRoute.stops[fromIdx!].name.en}
                          </span>{" "}
                          →{" "}
                          <span className="font-medium">
                            {selectedRoute.stops[toIdx!].name.en}
                          </span>
                        </p>
                        <div className="flex justify-center gap-2 pt-1">
                          <Badge variant="secondary">৳2.15/km</Badge>
                          <Badge variant="secondary">Min ৳10</Badge>
                          <Badge variant="secondary">Rounded to ৳5</Badge>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="fare-placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="rounded-xl border border-dashed border-border p-6 text-center space-y-2"
                      >
                        <Ticket className="h-8 w-8 text-muted-foreground mx-auto" />
                        <p className="text-sm text-muted-foreground">
                          Choose two different stops to see the fare
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <p className="text-[11px] text-muted-foreground text-center">
                    Rates based on ৳2.15/km. Minimum fare ৳10. Actual fares may
                    vary.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
