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
  style = { display: "block", minHeight: "100px" },
}: AdUnitProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Only proceed in production if desired to avoid console noise on localhost
    // if (process.env.NODE_ENV !== "production") return;

    try {
      // @ts-ignore
      const adsbygoogle = window.adsbygoogle || [];
      adsbygoogle.push({});
    } catch (err) {
      // These errors are common when navigating/resizing but usually don't break functionality
      console.warn("AdSense push failed:", err);
    }
  }, [pathname]); // Refresh ads on route change

  return (
    <div className={`ad-container w-full overflow-hidden ${className}`}>
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
