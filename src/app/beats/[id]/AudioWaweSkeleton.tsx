import { Skeleton } from "@/components/ui/skeleton";

export function AudioWaveSkeleton() {
  // Hardcoded heights for 60 bars
  const heights = [
  20, 40, 60, 30, 50, 70, 10, 35, 55, 45, 65, 25, 15, 75, 40, 30, 50, 20, 60,
  35,

  25, 48, 52, 18, 62, 76, 14, 38, 57, 46, 68, 23, 17, 71, 42, 32, 53, 22, 64,
  37,

  28, 43, 58, 34, 49, 72, 13, 39, 54, 47, 67, 26, 16, 73, 41, 33, 51, 21, 63,
  36,

  57, 46, 68, 23, 17, 46, 68,
];

  return (
    <div className="flex justify-between items-center w-full h-20 mt-12">
      <div className="flex items-center gap-1">
        {heights.map((height, i) => (
          <Skeleton
            key={i}
            className="w-[17px] rounded"
            style={{ height: `${height}px` }}
          />
        ))}
      </div>
      <Skeleton className="w-10 h-10 " />
    </div>
  );
}
