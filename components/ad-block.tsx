"use client";

import dynamic from "next/dynamic";

const AdUnitComponent = dynamic(() => import("./ad-unit"), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-[250px] bg-muted/10 animate-pulse rounded-lg" />
  ),
});

export default function AdBlock({ className }: { className?: string }) {
  return <AdUnitComponent className={className} />;
}
