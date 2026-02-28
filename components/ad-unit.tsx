"use client";

import { useEffect } from "react";

interface AdUnitProps {
  className?: string;
}

export default function AdUnit({ className }: AdUnitProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense Error:", err);
    }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-3448314338744263"
        data-ad-slot="2430405252"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
