"use client";

import { useState, useEffect, useCallback } from "react";

export interface FareSettings {
  minFare: number;
  farePerKm: number;
}

const DEFAULTS: FareSettings = { minFare: 10, farePerKm: 2.15 };
const STORAGE_KEY = "dmabfl_fare_settings";

export function useFareSettings() {
  const [settings, setSettings] = useState<FareSettings>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as FareSettings;
        if (parsed.minFare && parsed.farePerKm) setSettings(parsed);
      }
    } catch {}
    setLoaded(true);
  }, []);

  const updateSettings = useCallback((s: FareSettings) => {
    setSettings(s);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch {}
  }, []);

  const calcFare = useCallback(
    (distanceKm: number): number => {
      const raw = distanceKm * settings.farePerKm;
      return Math.max(settings.minFare, Math.ceil(raw / 5) * 5);
    },
    [settings]
  );

  return { settings, updateSettings, calcFare, loaded };
}
