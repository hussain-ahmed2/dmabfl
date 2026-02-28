"use client";

import { useEffect } from "react";

interface AdUnitProps {
  className?: string;
}

export default function AdUnit({ className }: AdUnitProps) {
  useEffect(() => {
    // Small delay to ensure the DOM has calculated the parent's width
    const timeout = setTimeout(() => {
      try {
        // @ts-ignore
        const adsbygoogle = window.adsbygoogle || [];
        adsbygoogle.push({});
      } catch (err) {
        // We log it but it's often suppressed by AdSense itself
        console.warn("AdSense push failed:", err);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={className} style={{ width: "100%" }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", minWidth: "250px", minHeight: "100px" }}
        data-ad-client="ca-pub-3448314338744263"
        data-ad-slot="2430405252"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
