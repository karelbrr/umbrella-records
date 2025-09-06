"use client";
import { useEffect, useState } from "react";
import { AudioList } from "./AudioList";
import ItemsPerRowButton from "./ItemsPerRowButton";

export default function Page() {
  const [itemsPerRow, setItemsPerRow] = useState<number>(5);

  useEffect(() => {
    const saved = localStorage.getItem("itemsPerRow");
    if (saved) setItemsPerRow(Number(saved));
  }, []);
  return (
    <section className="pl-10 pt-[10vh] pr-10 bg-black">
      <div className="flex items-center justify-between">
        <h1 className="text-[44px] opacity-90 font-extralight font-array-bold  text-white">
          beats/tracks
        </h1>
        <ItemsPerRowButton
          setItemsPerRow={setItemsPerRow}
          itemsPerRow={itemsPerRow}
        />
      </div>
      <AudioList itemsPerRow={itemsPerRow} />
    </section>
  );
}
