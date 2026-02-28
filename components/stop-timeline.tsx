import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Route } from "@/types";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";

interface StopTimelineProps {
  route: Route;
}

export default function StopTimeline({ route }: StopTimelineProps) {
  const stops = route.stops;
  const t = useTranslations("Route");
  const locale = useLocale();

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base flex items-center gap-2">
          🗺️ {t("routeDetails")}
          <span className="text-xs font-normal text-muted-foreground">
            ({stops.length} {t("stops")})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 px-4 pb-6">
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
                        {stop.distance} {t("km")}
                      </span>
                      {segDist && (
                        <p className="text-[10px] text-muted-foreground">
                          +{segDist} {t("km")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
