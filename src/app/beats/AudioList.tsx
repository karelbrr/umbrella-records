import { useQuery } from "@tanstack/react-query";
import { supabase } from "../createClient";
import AudioListItem from "./AudioListitem";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  itemsPerRow: number;
}

interface AudioList {
  id: string;
  name: string;
  bpm: number;
}

export function AudioList({ itemsPerRow }: Props) {
  async function fetchBeats() {
    const { data, error } = await supabase.from("beats_tracks").select("id,name,bpm");
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  const { data, error, isLoading } = useQuery<AudioList[]>({
    queryKey: ["beats"],
    queryFn: fetchBeats,
  });

  const skeletonCount = 10;

  return (
    <div
      className={`grid gap-x-10 min-h-[83vh] ${
        itemsPerRow === 5
          ? "grid-cols-5"
          : itemsPerRow === 6
          ? "grid-cols-6"
          : itemsPerRow === 7
          ? "grid-cols-7"
          : itemsPerRow === 8
          ? "grid-cols-8"
          : "grid-cols-5"
      }`}
    >
      {error && <p>{error.message}</p>}
      {isLoading
        ? Array.from({ length: skeletonCount }).map((_, i) => (
            <div key={i} className="flex flex-col items-center mt-10 ">
              <Skeleton className="w-full h-[263px] rounded-none" />
              <Skeleton className="w-3/4 h-[20px] mt-4 rounded-none" />
              <Skeleton className="w-2/4 h-[15px] mt-3 rounded-none" />
              <Skeleton className="w-2/4 h-[15px] mt-3 rounded-none" />
            </div>
          ))
        : data?.map((item) => (
            <AudioListItem
              key={item.id}
              id={item.id}
              itemsPerRow={itemsPerRow}
              name={item.name}
              bpm={item.bpm}
            />
          ))}
    </div>
  );
}
