"use client";
import { useState, useEffect } from "react";
import { AudioList } from "./AudioList";
import ItemsPerRowButton from "./ItemsPerRowButton";
import { FiltersBar } from "@/components/filters-bar";

export default function Page() {
  const [itemsPerRow, setItemsPerRow] = useState<number>(5);
  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("itemsPerRow");
    if (stored) {
      setItemsPerRow(Number(stored));
    }
  }, []);

  // Save to localStorage when itemsPerRow changes
  useEffect(() => {
    localStorage.setItem("itemsPerRow", String(itemsPerRow));
  }, [itemsPerRow]);

  return (
    <section className="container m-auto px-4 pt-[10vh]  bg-black">
      <div className="flex items-center justify-between">
        <h1 className="text-[44px] font-satoshi text-white font-semibold tracking-tight line-clamp-1 font-satoshi">
          beats/tracks
        </h1>
        
        <ItemsPerRowButton
          setItemsPerRow={setItemsPerRow}
          itemsPerRow={itemsPerRow}
        />
      </div>
      <FiltersBar/>
      <AudioList itemsPerRow={itemsPerRow} />
      
    </section>
  );
}
