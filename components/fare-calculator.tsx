"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpDown, Ticket } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { getFareBetweenStops, calculateFare } from "@/lib/busData";
import type { Route } from "@/types";

interface FareCalculatorProps {
  route: Route;
}

export default function FareCalculator({ route }: FareCalculatorProps) {
  const [fromIdx, setFromIdx] = useState<number | null>(null);
  const [toIdx, setToIdx] = useState<number | null>(null);

  const canCalc = fromIdx !== null && toIdx !== null && fromIdx !== toIdx;
  const fare = canCalc ? getFareBetweenStops(route, fromIdx, toIdx) : null;
  const distance = canCalc
    ? Math.abs(
        route.stops[toIdx].distance - route.stops[fromIdx].distance,
      ).toFixed(1)
    : null;

  return (
    <div className="space-y-4">
      {/* Calculator Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            🧮 Fare Calculator
          </CardTitle>
          <CardDescription>
            Select boarding and alighting stops to estimate fare.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* From Stop */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              From
            </label>
            <Select onValueChange={(v) => setFromIdx(Number(v))}>
              <SelectTrigger id="from-stop" className="w-full">
                <SelectValue placeholder="Select boarding stop" />
              </SelectTrigger>
              <SelectContent>
                {route.stops.map((stop, idx) => (
                  <SelectItem key={idx} value={String(idx)}>
                    {stop.name.en}
                    <span className="ml-2 text-muted-foreground text-xs">
                      {stop.distance} km
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Swap icon */}
          <div className="flex justify-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
              <ArrowUpDown className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* To Stop */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              To
            </label>
            <Select onValueChange={(v) => setToIdx(Number(v))}>
              <SelectTrigger id="to-stop" className="w-full">
                <SelectValue placeholder="Select alighting stop" />
              </SelectTrigger>
              <SelectContent>
                {route.stops.map((stop, idx) => (
                  <SelectItem key={idx} value={String(idx)}>
                    {stop.name.en}
                    <span className="ml-2 text-muted-foreground text-xs">
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
                key="result"
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="rounded-xl bg-primary/5 border border-primary/20 p-5 text-center space-y-1"
              >
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                  Estimated Fare
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-extrabold text-primary">
                    ৳{fare}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {distance} km · ৳2.15/km · min ৳10
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-xl border border-dashed border-border p-5 text-center space-y-1.5"
              >
                <Ticket className="h-6 w-6 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">
                  Select two different stops
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
            Rates: ৳2.15/km · Min ৳10 · Rounded to nearest ৳5.
            <br />
            Actual fares may vary.
          </p>
        </CardContent>
      </Card>

      {/* Fare table card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Fare from First Stop</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {route.stops.map((stop, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted/40 transition-colors"
              >
                <span className="text-foreground font-medium truncate mr-2">
                  {stop.name.en}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {stop.distance} km
                  </span>
                  {idx === 0 ? (
                    <Badge variant="secondary" className="text-xs">
                      Start
                    </Badge>
                  ) : (
                    <Badge className="text-xs font-bold">
                      ৳{calculateFare(stop.distance)}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
