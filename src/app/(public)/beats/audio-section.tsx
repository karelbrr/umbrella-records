"use client";
import { AudioList } from "./audio-list";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import { FiltersBar } from "./filters-bar";

interface BeatsFilters {
  genre?: string;
  key?: string;
  sortBy?: string;
  search?: string;
}

export function AudioSection() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const beatsFilters: BeatsFilters = {
    genre: searchParams.get("genre") || undefined,
    key: searchParams.get("key") || undefined,
    sortBy: searchParams.get("sortBy") || undefined,
    search: searchParams.get("search") || "",
  };

  const setBeatsFilters = useCallback(
    (update: BeatsFilters | ((prev: BeatsFilters) => BeatsFilters)) => {
      const params = new URLSearchParams(searchParams.toString());

      const newFilters =
        typeof update === "function" ? update(beatsFilters) : update;

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router, beatsFilters]
  );

  return (
    <>
      <FiltersBar
        beatsFilters={beatsFilters}
        setBeatsFilters={setBeatsFilters}
      />
      <AudioList
        beatsFilters={beatsFilters}
        setBeatsFilters={setBeatsFilters}
      />
    </>
  );
}
