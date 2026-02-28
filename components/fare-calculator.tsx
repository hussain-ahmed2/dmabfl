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
import { formatNumber } from "@/lib/utils";
import type { Route } from "@/types";
import { useTranslations, useLocale } from "next-intl";
import { useStore } from "@/hooks/store";

interface FareCalculatorProps {
  route: Route;
}

export default function FareCalculator({ route }: FareCalculatorProps) {
  const t = useTranslations("RouteCalc");
  const locale = useLocale();
  const { settings } = useStore();

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
            {t("title")}
          </CardTitle>
          <CardDescription>{t("desc")}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* From Stop */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t("from")}
            </label>
            <Select onValueChange={(v) => setFromIdx(Number(v))}>
              <SelectTrigger id="from-stop" className="w-full">
                <SelectValue placeholder={t("boardingStop")} />
              </SelectTrigger>
              <SelectContent>
                {route.stops.map((stop, idx) => (
                  <SelectItem key={idx} value={String(idx)}>
                    {locale === "en" ? stop.name.en : stop.name.bn}
                    <span className="ml-2 text-muted-foreground text-xs">
                      {formatNumber(stop.distance, locale)} {t("km")}
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
              {t("to")}
            </label>
            <Select onValueChange={(v) => setToIdx(Number(v))}>
              <SelectTrigger id="to-stop" className="w-full">
                <SelectValue placeholder={t("alightingStop")} />
              </SelectTrigger>
              <SelectContent>
                {route.stops.map((stop, idx) => (
                  <SelectItem key={idx} value={String(idx)}>
                    {locale === "en" ? stop.name.en : stop.name.bn}
                    <span className="ml-2 text-muted-foreground text-xs">
                      {formatNumber(stop.distance, locale)} {t("km")}
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
                  {t("estimatedFare")}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-extrabold text-primary">
                    ৳{formatNumber(fare, locale)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(distance!, locale)} {t("km")} · ৳
                  {formatNumber(settings.farePerKm, locale)}/{t("km")} · min ৳
                  {formatNumber(settings.minFare, locale)}
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
                  {t("selectDifferent")}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
            {t("ratesNote", {
              rate: formatNumber(settings.farePerKm, locale),
              minFare: formatNumber(settings.minFare, locale),
            })}
            <br />
            {t("actualNote")}
          </p>
        </CardContent>
      </Card>

      {/* Fare table card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">{t("fareFromFirst")}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {route.stops.map((stop, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted/40 transition-colors"
              >
                <span className="text-foreground font-medium truncate mr-2">
                  {locale === "en" ? stop.name.en : stop.name.bn}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {formatNumber(stop.distance, locale)} {t("km")}
                  </span>
                  {idx === 0 ? (
                    <Badge variant="secondary" className="text-xs">
                      {t("start")}
                    </Badge>
                  ) : (
                    <Badge className="text-xs font-bold">
                      ৳{formatNumber(calculateFare(stop.distance), locale)}
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
