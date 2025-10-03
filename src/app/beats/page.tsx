"use client";
import { useState } from "react";
import { AudioList } from "./AudioList";
import ItemsPerRowButton from "./ItemsPerRowButton";

export default function Page() {
  const [itemsPerRow, setItemsPerRow] = useState<number>(5);

  return (
    <section className="px-32 pt-[10vh]  bg-black">
      <div className="flex items-center justify-between">
        <h1 className="text-[44px] opacity-90 font-extralight font-satoshi text-white">
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
