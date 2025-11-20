"use client";

import { useEffect, useState } from "react";

export default function LocalTime() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const ampm = hours >= 12 ? "PM" : "AM";

      // convert to 12-hour format
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 → 12

      // add leading zeros
      const strHours = hours.toString().padStart(2, "0");
      const strMinutes = minutes.toString().padStart(2, "0");
      const strSeconds = seconds.toString().padStart(2, "0");

      setTime(`${ampm} // ${strHours}:${strMinutes}:${strSeconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div className="text-white font-satoshi text-xs lg:text-lg">{time}</div>;
}
