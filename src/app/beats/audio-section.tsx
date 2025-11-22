"use client";
import { useState } from "react";
import { AudioList } from "./audio-list";
import { FiltersBar } from "@/app/beats/filters-bar";

interface BeatsFilters {
  genre?: string;
  key?: string;
  sortBy?: string;
  search?: string;
}

export function AudioSection() {
  const [beatsFilters, setBeatsFilters] = useState<BeatsFilters>({
    genre: undefined,
    key: undefined,
    sortBy: undefined,
    search: "",
  });
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
