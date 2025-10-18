import { useQuery } from "@tanstack/react-query";
import { supabase } from "../createClient";
import AudioListItem from "./AudioListitem";
import { Skeleton } from "@/components/ui/skeleton";
import FetchError from "@/components/FetchError";

interface Props {
  itemsPerRow: number;
}

interface AudioListItemType {
  id: string;
  name: string;
  bpm: number;
  genres: { genre: string }[] | null;
}

export function AudioList({ itemsPerRow }: Props) {
  async function fetchBeats() {
    const { data, error } = await supabase
      .from("beats_tracks")
      .select("id,name,bpm,genres(genre)");

    if (error) throw new Error(error.message);

    return data.map((item) => ({
      ...item,
      genres: item.genres
        ? Array.isArray(item.genres)
          ? item.genres
          : [item.genres]
        : [],
    }));
  }

  const { data, error, isLoading } = useQuery<AudioListItemType[]>({
    queryKey: ["beats"],
    queryFn: fetchBeats,
  });

  const skeletonCount = 10;

  return (
    <div
      className={`grid gap-x-7 mt-5 min-h-[83vh] ${
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
      {isLoading || error
        ? Array.from({ length: skeletonCount }).map((_, i) => (
            <div key={i} className={`flex flex-col  items-start `}>
              <Skeleton className="w-full h-[260px] rounded-none" />
              <Skeleton className="w-3/4 h-[20px] mt-5 rounded-sm" />
              <Skeleton className="w-1/4 h-[15px] mt-3.5 rounded-sm" />
              <Skeleton className="w-3/4 h-[15px] mt-4 rounded-sm" />
            </div>
          ))
        : data?.map((item) => (
            <AudioListItem
              key={item.id}
              id={item.id}
              itemsPerRow={itemsPerRow}
              name={item.name}
              bpm={item.bpm}
              genre={Array.isArray(item.genres) && item.genres.length > 0 ? item.genres[0].genre : "unknown"}
            />
          ))}

      {error && <FetchError />}
    </div>
  );
}
