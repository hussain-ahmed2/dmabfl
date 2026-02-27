"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bus } from "lucide-react";
import { Button } from "@/components/ui/button";
import RouteCard from "@/components/route-card";
import SearchBar from "@/components/search-bar";
import { searchRoutes } from "@/lib/busData";
import type { Route } from "@/types";

interface RouteGridProps {
  initialRoutes: Route[];
}

export default function RouteGrid({ initialRoutes }: RouteGridProps) {
  const [query, setQuery] = useState("");

  const handleSearch = useCallback((q: string) => setQuery(q), []);

  const filtered = useMemo(() => {
    return query.trim() ? searchRoutes(query) : initialRoutes;
  }, [query, initialRoutes]);

  return (
    <div className="space-y-8">
      {/* Search */}
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search by route code, name, or stop (e.g. A-101, Farmgate)"
      />

      {/* Results label */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {query ? (
            <>
              <span className="font-semibold text-foreground">
                {filtered.length}
              </span>{" "}
              result{filtered.length !== 1 ? "s" : ""} for &quot;{query}&quot;
            </>
          ) : (
            <>
              Showing all{" "}
              <span className="font-semibold text-foreground">
                {filtered.length}
              </span>{" "}
              routes
            </>
          )}
        </p>
      </div>

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        {filtered.length > 0 ? (
          <motion.div
            key="grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filtered.map((route, i) => (
              <motion.div
                key={route.code.en}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
              >
                <RouteCard route={route} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 gap-4 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Bus className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">No routes found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try searching by route code like &quot;A-101&quot; or a stop
                like &quot;Mirpur-10&quot;
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setQuery("")}>
              Show all routes
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
