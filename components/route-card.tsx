import Link from "next/link";
import { MapPin, ArrowRight, Navigation } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Route } from "@/types";
import { routeToSlug, calculateFare } from "@/lib/busData";

interface RouteCardProps {
  route: Route;
}

export default function RouteCard({ route }: RouteCardProps) {
  const slug = routeToSlug(route);
  const totalDistance = route.stops.at(-1)?.distance ?? 0;
  const startStop = route.stops.at(0)?.name.en ?? "";
  const endStop = route.stops.at(-1)?.name.en ?? "";
  const maxFare = calculateFare(totalDistance);

  return (
    <Link href={`/routes/${slug}`} className="group block focus:outline-none">
      <Card className="h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:border-primary/30 group-focus-visible:ring-2 group-focus-visible:ring-primary">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <Badge
              variant="secondary"
              className="text-xs font-bold tracking-wide"
            >
              {route.code.en}
            </Badge>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary shrink-0" />
          </div>
          <p className="text-sm font-semibold leading-snug text-foreground line-clamp-2 pt-1">
            {route.name.en}
          </p>
        </CardHeader>

        <CardContent className="pt-0 space-y-3">
          {/* Route endpoints */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Navigation className="h-3 w-3 text-green-500 shrink-0" />
              <span className="truncate">{startStop}</span>
            </div>
            <div className="ml-[5px] w-px h-3 bg-border" />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 text-red-500 shrink-0" />
              <span className="truncate">{endStop}</span>
            </div>
          </div>

          {/* Footer stats */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>
                <span className="font-semibold text-foreground">
                  {route.stops.length}
                </span>{" "}
                stops
              </span>
              <span>·</span>
              <span>
                <span className="font-semibold text-foreground">
                  {totalDistance}
                </span>{" "}
                km
              </span>
            </div>
            <span className="text-xs font-semibold text-primary">
              up to ৳{maxFare}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
