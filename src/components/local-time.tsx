"use client";
import { useEffect, useState } from "react";

export default function LocalTime() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours(); // 24-hour format
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      // add leading zeros
      const strHours = hours.toString().padStart(2, "0");
      const strMinutes = minutes.toString().padStart(2, "0");
      const strSeconds = seconds.toString().padStart(2, "0");

      setTime(`${strHours}:${strMinutes}:${strSeconds}`);
    };

    const interval = setInterval(updateTime, 1000);
    updateTime(); // set immediately

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-white font-satoshi text-xs lg:text-lg ">
      umbrella records // {time}
    </div>
  );
}
