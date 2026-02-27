import Link from "next/link";
import { ChevronLeft, MapPin, Route as RouteIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Route } from "@/types";

interface RouteHeroProps {
  route: Route;
}

export default function RouteHero({ route }: RouteHeroProps) {
  const totalDistance = route.stops.at(-1)?.distance ?? 0;
  const startStop = route.stops.at(0)?.name.en ?? "";
  const endStop = route.stops.at(-1)?.name.en ?? "";

  return (
    <div className="relative overflow-hidden bg-linear-to-br from-primary/90 via-primary to-primary/60 text-primary-foreground">
      {/* decorative blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-black/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-10 space-y-5">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 -ml-1"
        >
          <Link href="/">
            <ChevronLeft className="h-4 w-4 mr-1" />
            All Routes
          </Link>
        </Button>

        {/* Code + name */}
        <div className="space-y-2">
          <Badge className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/30 text-xs font-bold tracking-wider">
            {route.code.en}
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight max-w-xl">
            {route.name.en}
          </h1>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-primary-foreground/80">
          <span className="flex items-center gap-1.5">
            <RouteIcon className="h-3.5 w-3.5" />
            <strong className="text-primary-foreground">
              {route.stops.length}
            </strong>{" "}
            stops
          </span>
          <span className="text-primary-foreground/40">·</span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <strong className="text-primary-foreground">
              {totalDistance} km
            </strong>{" "}
            total
          </span>
          <span className="text-primary-foreground/40">·</span>
          <span>
            {startStop} → {endStop}
          </span>
        </div>
      </div>
    </div>
  );
}
