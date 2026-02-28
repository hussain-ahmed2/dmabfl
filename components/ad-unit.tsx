"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface AdUnitProps {
  className?: string;
  slot?: string;
  format?: "auto" | "fluid" | "rectangle";
  responsive?: "true" | "false";
  style?: React.CSSProperties;
}

export default function AdUnit({
  className = "",
  slot = "2430405252",
  format = "auto",
  responsive = "true",
  style = { display: "block", minHeight: "100px", width: "100%" },
}: AdUnitProps) {
  const pathname = usePathname();
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // We use a small timeout to wait for the browser to finish calculating the layout.
    // This solves the "No slot size for availableWidth=0" error in Next.js/SPAs.
    const timeout = setTimeout(() => {
      try {
        if (adRef.current && adRef.current.offsetWidth > 0) {
          // @ts-ignore
          const adsbygoogle = window.adsbygoogle || [];
          adsbygoogle.push({});
        }
      } catch (err) {
        console.warn("AdSense push failed:", err);
      }
    }, 200); // 200ms is a safe buffer for most layout shifts

    return () => clearTimeout(timeout);
  }, [pathname]); // Refresh ads on route change

  return (
    <div
      ref={adRef}
      className={`ad-container w-full overflow-hidden flex justify-center ${className}`}
      style={{ minWidth: "250px" }}
    >
      <ins
        key={`adsense-${pathname}-${slot}`} // Force a fresh component on navigation
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-3448314338744263"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}
