import { getAllRoutes, getRouteBySlug } from "@/lib/busData";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import RouteHero from "@/components/route-hero";
import StopTimeline from "@/components/stop-timeline";
import FareCalculator from "@/components/fare-calculator";

export function generateStaticParams() {
  return getAllRoutes().map((route) => ({
    slug: route.code.en.toLowerCase().replace(/\s/g, "-"),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const route = getRouteBySlug(slug);
  if (!route) return { title: "Route Not Found" };
  return {
    title: `${route.code.en} – ${route.name.en}`,
    description: `${route.stops.length} stops · ${route.stops.at(-1)?.distance ?? 0} km · Bus route in Dhaka Metro Area.`,
  };
}

export default async function RouteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const route = getRouteBySlug(slug);
  if (!route) notFound();

  return (
    <main className="min-h-screen">
      <RouteHero route={route} />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Stop timeline – takes up wider left column */}
          <div className="lg:col-span-3">
            <StopTimeline route={route} />
          </div>

          {/* Fare calculator – sticky right column */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <FareCalculator route={route} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
